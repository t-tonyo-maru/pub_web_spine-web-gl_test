import * as spine from '@esotericsoftware/spine-webgl'

window.onload = () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement

  new spine.SpineCanvas(canvas, {
    pathPrefix: 'assets/spine-data/',
    app: new App()
  })
}

class App implements spine.SpineCanvasApp {
  public skeleton: spine.Skeleton | null
  public state: spine.AnimationState | null

  constructor() {
    this.skeleton = null
    this.state = null
  }

  loadAssets(canvas: spine.SpineCanvas) {
    // canvas.assetManager.AnimationState
    canvas.assetManager.loadTextureAtlas('mix-and-match-pma.atlas')
    canvas.assetManager.loadBinary('mix-and-match-pro.skel')
  }

  initialize(canvas: spine.SpineCanvas) {
    const assetManager = canvas.assetManager

    // Create the atlas
    const atlas = canvas.assetManager.require('mix-and-match-pma.atlas')
    const atlasLoader = new spine.AtlasAttachmentLoader(atlas)

    // Create the skeleton
    const skeletonBinary = new spine.SkeletonBinary(atlasLoader)
    skeletonBinary.scale = 0.5

    let resultskeletonData:spine.SkeletonData
    try {
      resultskeletonData = skeletonBinary.readSkeletonData(
        assetManager.require('mix-and-match-pro.skel')
      )
    } catch (err) {
      console.log(err)
    }

    this.skeleton = new spine.Skeleton(resultskeletonData!)

    // Create the animation state
    const stateData = new spine.AnimationStateData(resultskeletonData!)
    this.state = new spine.AnimationState(stateData)
    this.state.setAnimation(0, 'dance', true)

    // Create a new skin, by mixing and matching other skins
    // that fit together. Items making up the girl are individual
    // skins. Using the skin API, a new skin is created which is
    // a combination of all these individual item skins.
    const mixAndMatchSkin = new spine.Skin('custom-girl')
    mixAndMatchSkin.addSkin(resultskeletonData!.findSkin('skin-base') as spine.Skin)
    mixAndMatchSkin.addSkin(resultskeletonData!.findSkin('nose/short') as spine.Skin)
    mixAndMatchSkin.addSkin(resultskeletonData!.findSkin('eyelids/girly') as spine.Skin)
    mixAndMatchSkin.addSkin(resultskeletonData!.findSkin('eyes/violet') as spine.Skin)
    mixAndMatchSkin.addSkin(resultskeletonData!.findSkin('hair/brown') as spine.Skin)
    mixAndMatchSkin.addSkin(resultskeletonData!.findSkin('clothes/hoodie-orange') as spine.Skin)
    mixAndMatchSkin.addSkin(resultskeletonData!.findSkin('legs/pants-jeans') as spine.Skin)
    mixAndMatchSkin.addSkin(resultskeletonData!.findSkin('accessories/bag') as spine.Skin)
    mixAndMatchSkin.addSkin(resultskeletonData!.findSkin('accessories/hat-red-yellow') as spine.Skin)
    this.skeleton.setSkin(mixAndMatchSkin)
  }

  update(canvas: spine.SpineCanvas, delta: number) {
    this.state!.update(delta)
    this.state!.apply(this.skeleton!)
    this.skeleton!.updateWorldTransform()
  }

  render(canvas: spine.SpineCanvas) {
    const renderer = canvas.renderer
    renderer.resize(spine.ResizeMode.Expand)
    canvas.clear(0.2, 0.2, 0.2, 1)
    renderer.begin()
    renderer.drawSkeleton(this.skeleton!, true)
    renderer.end()
  }
}
