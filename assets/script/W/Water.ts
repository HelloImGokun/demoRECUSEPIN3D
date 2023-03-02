import { _decorator, Collider, Component, ITriggerEvent, Node, CCFloat } from 'cc';
import { PointNode } from '../P/PointNode';
import { Configs } from '../../utils/Configs';
import { PlayerController } from '../PlayerController';
const { ccclass, property } = _decorator;

@ccclass('Water')
export class Water extends Component {
    @property(Node)
    private attachPathNode:Node;
    @property(Collider)
    private waterCollider:Collider;

    @property(CCFloat)
    private waterFloatY:number = 0;
    
    private isWaterTrigger:boolean = false;
    start() {
        this.waterCollider.on('onTriggerEnter', this.onTriggerEnter, this);
    }

    private onTriggerEnter(event: ITriggerEvent) {
        let collisionNode: Node = event.otherCollider.node;

        if(collisionNode.name.includes(Configs.PLAYER_NAME)){
            if(this.isWaterTrigger) return;
            this.isWaterTrigger=true;
            //unlock
            console.log('trigger',collisionNode.name);
            if(this.attachPathNode && collisionNode.getComponent(PlayerController).getIsFloat()){
                this.scheduleOnce(()=>{
                    this.attachPathNode.getComponent(PointNode).setUnlock();
                    //thong bao cho level mo pin => player check path
                    //thong bao cho player tim duong
                    collisionNode.getComponent(PlayerController).findPath();
                },0.5)
             
            }
        }
      

    }
    public getWaterFloatY(){
        return this.waterFloatY;
    }
}


