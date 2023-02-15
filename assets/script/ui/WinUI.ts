import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

@ccclass('WinUI')
export class WinUI extends Component {
    private nextButtonCallback;
    setUp(nextButtonCallback){
        this.nextButtonCallback = nextButtonCallback;
    }
    onNextLevel(){
        this.node.destroy();
        //
        if(this.nextButtonCallback){
            this.nextButtonCallback();
        }
    }
}


