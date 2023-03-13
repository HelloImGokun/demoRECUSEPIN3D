import { _decorator, Collider, Component, ITriggerEvent, tween, Vec3, Node, CCBoolean, director } from 'cc';
import { Configs } from '../../utils/Configs';
import { PlayerController } from '../controller/PlayerController';
import { Killer_hunter } from '../K/Killer_hunter';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {
    //check xem dan ban tu sung cua killer hay khong?
    @property(CCBoolean)
    isShootFromKiller: boolean = false;
    direction;
    setUp(direction) {
        let collider = this.getComponent(Collider);
        collider.on('onTriggerEnter', this.onTriggerEnter, this);
        //forward
        //tween(this.node).by(20, { position: new Vec3(bulletDirection * 0, 50, 0) }).start();
        // this.scheduleOnce(()=>{
        //     if(this.node) this.node.destroy();
        // },10)
        this.direction = direction;
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
            if(this.isShootFromKiller){
                //no effet
                return ;
            }else{
                if (otherNode)
                otherNode.getComponent(Killer_hunter).setDie();
            }

        }
        console.log("--------------------------------",name);
        this.node.destroy();
       
        // this.scheduleOnce(() => {
        //     this.isAttack = false;
        //     //player

        // }, 2)  
    }
    update(delta: number){
        this.node.translate(this.direction);
    }
}



