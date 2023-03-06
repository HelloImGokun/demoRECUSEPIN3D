import { _decorator, Collider, Component, ICollisionEvent, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {
    setUp(bulletDirection: number) {
        let collider = this.getComponent(Collider);
        collider.on('onCollisionEnter', this.onCollisionEnter, this);
        //forward
        tween(this.node).by(20,{position:new Vec3(bulletDirection*0,50,0)}).start();
    }
    onCollisionEnter(event: ICollisionEvent) {
            // if(this.node)
            this.scheduleOnce(() => {
                this.node.destroy();
            }, 0.1);
            
    }
}



