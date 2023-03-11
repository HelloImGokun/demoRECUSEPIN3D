import { _decorator, Collider, Component, ITriggerEvent, Node } from 'cc';
import { Configs } from '../../utils/Configs';
const { ccclass, property } = _decorator;

@ccclass('Fireball_and_Waterball')
export class Fireball_and_Waterball extends Component {
    start() {
        let collider = this.getComponent(Collider);
        collider.on('onTriggerEnter', this.onTriggerEnter, this);
    }

    private onTriggerEnter(event: ITriggerEvent) {
        let collisionNode: Node = event.otherCollider.node;
        if(collisionNode.name.includes(Configs.PLAYER_NAME)||collisionNode.name.includes(Configs.KILL_ALL_OBJ)||collisionNode.name.includes(Configs.KILL_HUNTER)){
            this.scheduleOnce(() => {
                this.node.destroy();
            }, 0.7);
        }
       
    }
}


