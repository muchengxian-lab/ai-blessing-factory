const automator = require('miniprogram-automator');

(async () => {
  let mp;
  try {
    mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
    await mp.reLaunch('/pages/index/index');
    await new Promise(r => setTimeout(r, 3000));

    // Light intercept - just log calls without consuming streams
    await mp.evaluate(() => {
      window.__log = [];

      const origCF = wx.cloud.callFunction.bind(wx.cloud);
      wx.cloud.callFunction = function(opts) {
        window.__log.push('CF>> ' + opts.name);
        return origCF(opts).then(res => {
          const r = res.result || {};
          window.__log.push(`CF<< ${opts.name} code=${r.code} src=${r.source} id=${r.blessingId} bc=${(r.blessings||[]).length} msg="${r.message||''}"`);
          return res;
        }).catch(err => {
          window.__log.push('CF-ERR ' + opts.name + ': ' + err.message);
          throw err;
        });
      };

      const origCM = wx.cloud.extend.AI.createModel.bind(wx.cloud.extend.AI);
      wx.cloud.extend.AI.createModel = function(provider) {
        window.__log.push('AI-CM ' + provider);
        return origCM(provider);
      };
    });

    console.log('[test] 点击生成...');
    await mp.evaluate(() => {
      const p = getCurrentPages()[0];
      if (p) p.onGenerate();
    });

    await new Promise(r => setTimeout(r, 30000));

    // Read logs
    const logs = await mp.evaluate(() => window.__log || []);
    console.log('\n=== 调用链路 ===');
    logs.forEach(l => console.log('  ' + l));

    // Check final result
    const state = await mp.evaluate(() => {
      const p = getCurrentPages()[getCurrentPages().length - 1];
      return p ? {
        route: p.route,
        blessings: p.data.blessings,
        id: p.data.blessingId,
        loading: p.data.loading,
        holiday: p.data.holiday,
      } : null;
    });

    console.log('\n=== 最终结果 ===');
    console.log('页面:', state?.route);
    console.log('holiday:', state?.holiday);
    console.log('loading:', state?.loading);
    console.log('blessingId:', state?.id);
    if (state?.blessings) {
      state.blessings.forEach((b, i) => {
        const len = b.length;
        const type = len > 60 && !b.includes('愿这份祝福带来平安') ? 'AI' : 'Fallback';
        console.log(`  [${i}] [${type} ${len}字] ${b.substring(0, 100)}`);
      });
    }

  } catch (err) {
    console.error('[test]', err.message);
  } finally {
    if (mp) await mp.disconnect();
  }
})();
