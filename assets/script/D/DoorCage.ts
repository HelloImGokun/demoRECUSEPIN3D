import { _decorator, Collider, Component, ICollisionEvent, ITriggerEvent, Node, tween, Vec3 } from 'cc';
import { Configs } from '../../utils/Configs';
const { ccclass, property } = _decorator;

@ccclass('DoorCage')
export class DoorCage extends Component {
    isOpen: boolean = false;
    start() {
        let collider = this.getComponent(Collider);
        collider.on('onTriggerStay', this.onTriggerStay, this);
    }

    private onTriggerStay(event: ITriggerEvent) {
        let collisionNode: Node = event.otherCollider.node;
        if (this.isOpen) return;
        this.isOpen = true;
        //deactive door
        setTimeout(() => {
            if (collisionNode.name.includes(Configs.PLAYER_NAME)) {
                tween(this.node).sequence(
                    tween(this.node).by(0.5, { position: new Vec3(-1, 0, 0) }),
                    tween().call(() => {
                        this.node.destroy();
                    })
                ).start();

            }
        }, 300);

    }
}



