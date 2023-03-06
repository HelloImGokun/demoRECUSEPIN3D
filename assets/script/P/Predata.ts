import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;
import { Playerdata } from './Playerdata';
import { Configs } from '../../utils/Configs';

@ccclass('Predata')
export class Predata extends Component {
   public static instant: Predata;
   public levelPlayer :number = 1;
   public currentLevel: number = 16;
    start() {
        if(Predata.instant == null){
            Predata.instant = this;
            director.addPersistRootNode(this.node);
        }
        if(Playerdata.getStorage(Configs.KEY_STORAGE_LEVEL_PLAYER)){
            this.levelPlayer = Number(Playerdata.getStorage(Configs.KEY_STORAGE_LEVEL_PLAYER));
        }
        else{
            this.levelPlayer = 1;
        }
    }
    public getSaveLevel(){
        return this.currentLevel;
    }
    public setSaveLevel(level:number){
        this.currentLevel = level;
        Playerdata.saveStorage(Configs.KEY_STORAGE_LEVEL_PLAYER,level);
    }
    
    
}


