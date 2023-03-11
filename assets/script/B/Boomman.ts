import { _decorator, Collider, Component, ICollisionEvent, instantiate, Node, Prefab } from 'cc';
import { Configs } from '../../utils/Configs';
import { Killer_hunter } from '../K/Killer_hunter';
const { ccclass, property } = _decorator;

@ccclass('Boomman')
export class Boomman extends Component {
    // @property(Prefab)
    // explosionPrefab:Prefab | null = null;
    @property(Node)
    bombMan:Node | null = null;
    // isExplosived:boolean=false;
    start () {
        // [3]
        let collider = this.getComponent(Collider);
        collider.on('onCollisionEnter',this.onCollisionEnter,this);
    }
    onCollisionEnter(event:ICollisionEvent){
        // if(this.isExplosived) return;
        let name = event.otherCollider.node.name;
        if (name.includes(Configs.PLAYER_NAME)||name.includes(Configs.KILL_HUNTER)||name.includes(Configs.KILL_ALL_OBJ)){
            this.blow();
        }   
    }
    blow(){
        //hide it
        // this.isExplosived=true;
        this.bombMan.destroy();
        //init explosion
        // let explosion = instantiate(this.explosionPrefab);
        // this.node.addChild(explosion);
       this.scheduleOnce(()=>{
        this.node.destroy();
       },1);     
    }
}


