import { _decorator, Collider, Component, ITriggerEvent, Node } from 'cc';
import { PointNode } from '../P/PointNode';
import { Configs } from '../../utils/Configs';
import { PlayerController } from '../PlayerController';
const { ccclass, property } = _decorator;

@ccclass('Water')
export class Water extends Component {
    @property(Node)
    private attachPathNode:Node;
    start() {
        let collider = this.getComponent(Collider);
        collider.on('onTriggerEnter', this.onTriggerEnter, this);
    }

    private onTriggerEnter(event: ITriggerEvent) {
        let collisionNode: Node = event.otherCollider.node;
        console.log('water',collisionNode.name)
        if(collisionNode.name.includes(Configs.PLAYER_NAME)){
            //unlock
            if(this.attachPathNode){
                this.scheduleOnce(()=>{
                    this.attachPathNode.getComponent(PointNode).setUnlock();
                    //thong bao cho level mo pin => player check path
                    //thong bao cho player tim duong
                    collisionNode.getComponent(PlayerController).findPath();
                },0.5)
             
            }
        }
      

    }
}


