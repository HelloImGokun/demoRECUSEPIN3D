import { _decorator, Component, director } from 'cc';
const { ccclass } = _decorator;

@ccclass('LoseUI')
export class LoseUI extends Component {
    private ReloadButtonCallback;
    setUp(ReloadButtonCallback){
        this.ReloadButtonCallback = ReloadButtonCallback;
    }
    
    OnReload(){
        director.loadScene('game');
        if(this.ReloadButtonCallback){
            this.ReloadButtonCallback;
        }
    }

}


