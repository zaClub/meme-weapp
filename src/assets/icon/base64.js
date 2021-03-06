import wepy from 'wepy'

export default class Base64 extends wepy.mixin {
  
  data = {
    successIcon: `data:image/png;base64,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`,
    failIcon: `data:image/png;base64,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`,
  }

}
