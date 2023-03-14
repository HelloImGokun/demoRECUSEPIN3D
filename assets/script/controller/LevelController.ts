import { _decorator, Component, instantiate, Node, Vec3, Vec2 } from 'cc';
import { Pin } from '../P/Pin';
import { PathList } from '../P/PathList';
import { ResouceUtils } from '../../utils/ResouceUtils';
import { Configs } from '../../utils/Configs';
import { PlayerController_remake } from '../P/PlayerController_remake';
import { PlayerController } from './PlayerController';
const { ccclass, property } = _decorator;

@ccclass('LevelController')
export class LevelController extends Component {
    private winCallback;
    private loseCallback;
    private rayToChildCallback;
    private touchMoveCallback;
    //selected moving pin
    protected currentMovePin:Node;
    @property({ type: Node })
    private pinList: Node[] = [];
    //
    @property(PathList)
    private pathList: PathList[] = [];
    //
    //point list 
    //p1,p2
    //vi tri xp cuar player
    @property(Vec3)
    private playerPos: Vec3 = new Vec3(0, 0, 0);

    private player: PlayerController;
    setUp(winCallback,loseCallback) {
        //setup player
        //khoi tao player
        ResouceUtils.loadPrefab(Configs.PLAYER_PREFAB_PATH+'player1', (playerPrefab) => {
            let newPlayer: Node = instantiate(playerPrefab);
            this.player = newPlayer.getComponent(PlayerController);
            console.log(this.player)
            //set pos
            newPlayer.setPosition(this.playerPos);
            this.node.addChild(newPlayer);
        })

        //
        this.winCallback = winCallback;
        //setup pin event
        if (this.pinList && this.pinList.length > 0) {
            for (let i = 0; i < this.pinList.length; i++) {
                // console.log('set pin callback')
                this.pinList[i].getComponent(Pin).setUpCallback(()=>{
                    //thong bao cho player
                    console.log(this.player)
                    this.player.findPath();
                });
            }
        }
        //
        this.loseCallback = loseCallback;
    }
    //lay list all duong di
    public getPathList(){
        console.log('aaaa')
        console.log(this.pathList);
        
        return this.pathList;
    }
    //pass tu Ray to cua GameController vao
    public rayResult(raycastResult) {
        //pass ray vao level cu the (level)
        if (this.rayToChildCallback) {
            this.rayToChildCallback(raycastResult);
        }
    }
    //set position 
    public onMovePin(location:Vec2){
        console.log(location)
        if(this.touchMoveCallback){
            this.touchMoveCallback(location);
        }
    }
    //
    public onTouchCancel(){
        this.currentMovePin=null;
    }
    //setup raycast callback from prarent class to extend class
    protected setUpRaycastCallback(parentCallback,touchMoveCallback = null) {
        this.rayToChildCallback = parentCallback;
        this.touchMoveCallback = touchMoveCallback;
    }
    //
    public winLevel() {
        if (this.winCallback) {
            this.winCallback();

        }
    }
    //
    public loseGame() {
        if (this.loseCallback) {
            this.loseCallback();
        }
    }
    //callback tu con ve cha
    protected callbackTuConVeCha(callback) {
        if (callback) {
            callback();
        }
    }
    onDisable() {
        console.log('disable');
    }
    onDestroy() {
        console.log('destroyed');
    }
    
    //
    update(deltaTime: number) {

    }
}


