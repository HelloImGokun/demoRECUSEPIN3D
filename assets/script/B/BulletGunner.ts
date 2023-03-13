import { _decorator, Component, Node, Vec2, Vec3, Collider, ITriggerEvent } from 'cc';
import { Configs } from '../../utils/Configs';
import { PlayerController } from '../controller/PlayerController';
const { ccclass, property } = _decorator;

@ccclass('BulletGunner')
export class BulletGunner extends Component {
    direction:Vec3 | null = null;
    setUp(direction){
        this.direction = direction;
        let collider = this.getComponent(Collider);
        collider.on('onTriggerEnter', this.onTriggerEnter, this);
        this.scheduleOnce(()=>{
            if(this.node)
            this.node.destroy();
        },2)
    }

    onTriggerEnter(event: ITriggerEvent) {
        // if(this.node)
        let otherNode: Node = event.otherCollider.node;
        let name = otherNode.name;
        console.log(name);
        if (name.includes(Configs.PLAYER_NAME)) {
            if (otherNode)
                otherNode.getComponent(PlayerController).setDie();
        } 
        this.node.destroy();
        // this.scheduleOnce(() => {
        //     this.isAttack = false;
        //     //player

        // }, 2)  
    }
    update(deltaTime: number) {
        this.node.translate(this.direction);
    }
}


