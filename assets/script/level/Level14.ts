import { _decorator, Component, Node } from 'cc';
import { LevelController } from '../controller/LevelController';
import { Configs } from '../../utils/Configs';
import { Pin } from '../P/Pin';
const { ccclass, property } = _decorator;

@ccclass('Level14')
export class Level14 extends LevelController {
    start() {
        //set up parent raycast
        this.setUpRaycastCallback((rayData)=>{
            console.log(this.name,rayData);
            for(let i = 0; i < rayData.length;i++){
                console.log('ray',rayData[i].collider.node.name);
                this.rayToNode(rayData[i].collider.node)
            }
        })
        //
    
    }
    //===============LEVEL LOGIC HERE!========================///
    private rayToNode(whichNode:Node){
        if(whichNode.name.includes(Configs.PIN_NAME)){
            //pull the pin
            whichNode.getComponent(Pin).onTouchMe();
        }
    }   
}


