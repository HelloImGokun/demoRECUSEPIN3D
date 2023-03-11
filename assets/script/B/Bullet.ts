import { _decorator, Collider, Component, ITriggerEvent, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {
    setUp(bulletDirection: number) {
        let collider = this.getComponent(Collider);
        collider.on('onTriggerEnter', this.onTriggerEnter, this);
        //forward
        tween(this.node).by(20,{position:new Vec3(bulletDirection*0,50,0)}).start();
    }
    onTriggerEnter(event: ITriggerEvent) {
            // if(this.node)
            console.log('boom',event.otherCollider.node.name);
                this.node.destroy();         
    }
}



