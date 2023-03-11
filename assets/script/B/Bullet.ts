import { _decorator, Collider, Component, ITriggerEvent, tween, Vec3, Node } from 'cc';
import { Configs } from '../../utils/Configs';
import { PlayerController } from '../controller/PlayerController';
import { Killer_hunter } from '../K/Killer_hunter';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {
    setUp(bulletDirection: number) {
        let collider = this.getComponent(Collider);
        collider.on('onTriggerEnter', this.onTriggerEnter, this);
        //forward
        tween(this.node).by(20, { position: new Vec3(bulletDirection * 0, 50, 0) }).start();
    }
    onTriggerEnter(event: ITriggerEvent) {
        // if(this.node)
        let otherNode: Node = event.otherCollider.node;
        let name = otherNode.name;
        console.log(name);
        if (name.includes(Configs.PLAYER_NAME)) {
            if (otherNode)
                otherNode.getComponent(PlayerController).setDie();
        } else if (name.includes(Configs.KILL_HUNTER)) {
            if (otherNode)
                otherNode.getComponent(Killer_hunter).setDie();
        }
        this.node.destroy();
        // this.scheduleOnce(() => {
        //     this.isAttack = false;
        //     //player

        // }, 2)  
    }
}



