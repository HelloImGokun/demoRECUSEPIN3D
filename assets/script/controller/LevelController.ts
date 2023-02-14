import { _decorator, Component, Node } from 'cc';
import { Pin } from '../P/Pin';
import { PlayerController } from '../PlayerController';
const { ccclass, property } = _decorator;

@ccclass('LevelController')
export class LevelController extends Component {
    private winCallback;
    private loseCallback;
    private rayToChildCallback;
    @property({type:Node})
    private pinList :Node [] = [];

    @property(Node)
    private pathList1:Node[]=[];
    @property(Node)
    private pathList2:Node[]=[];
    @property(Node)
    private player:Node = null;
    //point list
    //p1,p2
    start(){
      
    }
    setUp(winCallback){
        this.winCallback = winCallback;
        //setup pin event
        if(this.pinList&&this.pinList.length>0){
            for(let i = 0;i<this.pinList.length;i++){
                console.log('set pin callback')
                this.pinList[i].getComponent(Pin).setUpCallback(()=>{
                    console.log('call to player')
                    if(this.player){
                        this.player.getComponent(PlayerController).findPath();
                    }
    
                });
            }
        }

       
    }
    //pass tu Ray to cua GameController vao
    public rayResult(raycastResult){
        //pass ray vao level cu the (level)
        if(this.rayToChildCallback){
            this.rayToChildCallback(raycastResult);
        }
    }
    //setup raycast callback from prarent class to extend class
    protected setUpRaycastCallback(parentCallback){
        this.rayToChildCallback= parentCallback;
    }
    //
    public winLevel(){
        if(this.winCallback){
            this.winCallback();
            
        }
    }
    //
    protected loseGame(){
        if(this.loseCallback){
            this.loseCallback();
        }
    }
    //callback tu con ve cha
    protected callbackTuConVeCha(callback){
        if(callback){
            callback();
        }
    }
    onDisable(){
        console.log('disable');
    }
    onDestroy(){
        console.log('destroyed');
    }
    //
    update(deltaTime: number) {
        
    }
}


