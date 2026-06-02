Component({
  properties: {
    text: { type: String, value: '' },
    index: { type: Number, value: 0 },
    total: { type: Number, value: 1 },
  },
  methods: {
    onPrev() { if (this.data.index > 0) this.triggerEvent('prev'); },
    onNext() { if (this.data.index < this.data.total - 1) this.triggerEvent('next'); },
  },
});
