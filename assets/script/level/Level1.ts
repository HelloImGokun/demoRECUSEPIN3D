import { _decorator ,Node} from 'cc';
import { Configs } from '../../utils/Configs';
import { LevelController } from '../controller/LevelController';
import { Pin } from '../P/Pin';
const { ccclass, property } = _decorator;

@ccclass('Level1')
export class Level1 extends LevelController {
    @property(Node)
    private pin:Node | null = null;
    start() {
        //set up parent raycast
        this.setUpRaycastCallback((rayData)=>{
            console.log(this.name,rayData);
            for(let i = 0; i < rayData.length;i++){
                console.log('ray',rayData[i].collider.node.name);
                this.rayToNode(rayData[i].collider.node)
            }
        })
    
    }
    //===============LEVEL LOGIC HERE!========================///
    private rayToNode(whichNode:Node){
        if(whichNode.name.includes(Configs.PIN_NAME)){
            //pull the pin
            whichNode.getComponent(Pin).onTouchMe();
        }
    }
    //===============LEVEL LOGIC HERE!========================///
    

}
