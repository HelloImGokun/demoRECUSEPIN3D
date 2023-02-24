import { _decorator, Component, Node } from 'cc';
import { LevelController } from '../controller/LevelController';
import { Configs } from '../../utils/Configs';
import { Pin } from '../P/Pin';
const { ccclass, property } = _decorator;

@ccclass('Level19')
export class Level19 extends LevelController {
    sstart() {
        //set up parent raycast callback
        this.setUpRaycastCallback((rayData) => {
            for (let i = 0; i < rayData.length; i++) {
                console.log('ray', rayData[i].collider.node.name);
                this.rayToNode(rayData[i].collider.node)
            }
        })       
    }

    private rayToNode(whichNode: Node) {
        if (whichNode.name.includes(Configs.PIN_NAME)) {
            //pull the pin
            whichNode.getComponent(Pin).onTouchMe();
        }
    }
}


