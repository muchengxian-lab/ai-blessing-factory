Component({
  properties: {
    text: { type: String, value: '暂无内容' },
    showBtn: { type: Boolean, value: false },
    btnText: { type: String, value: '去首页' },
  },
  methods: {
    onTap() { this.triggerEvent('btntap'); },
  },
});
