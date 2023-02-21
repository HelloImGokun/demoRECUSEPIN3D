import { _decorator, Component, Node, Collider, ITriggerEvent } from 'cc';
import { Configs } from '../../utils/Configs';
import { PointNode } from '../P/PointNode';
const { ccclass, property } = _decorator;

@ccclass('Float')
export class Float extends Component {
    @property(Node)
    private attachPathNode:Node;
    start() {
        let collider = this.getComponent(Collider);
        collider.on('onTriggerEnter', this.onTriggerEnter, this);
    }

    private onTriggerEnter(event: ITriggerEvent) {
        let collisionNode: Node = event.otherCollider.node;
        if(this.attachPathNode){
            this.attachPathNode.getComponent(PointNode).setUnlock();
            //thong bao cho level mo pin => player check path
            //this.callbackToLevel();
        }
        setTimeout(() => {
            if (collisionNode.name.includes(Configs.PLAYER_NAME)) {
                this.node.destroy();
            }
        },500);
    }

}


