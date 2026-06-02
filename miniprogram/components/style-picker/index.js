Component({
  properties: {
    styles: { type: Array, value: [] },
    active: { type: String, value: '' },
  },
  methods: {
    onSelect(e) {
      this.triggerEvent('select', { id: e.currentTarget.dataset.id });
    },
  },
});
