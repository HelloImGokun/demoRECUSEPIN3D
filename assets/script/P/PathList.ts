import { _decorator, CCBoolean, Component } from 'cc';
import { PointNode } from './PointNode';
const { ccclass, property } = _decorator;

@ccclass('PathList')
export class PathList extends Component {
    @property(PointNode)
    private pointList:PointNode[]=[];
    @property(CCBoolean)
    private isPass:boolean=false;
    start() {

    }
    getPointList(){
        console.log(this.node.name,this.pointList.length);
        if(this.isPass) return null;
        return this.pointList;
    }
    setIsPass(){
        console.log('lock this');
        this.isPass=true;
    }
}


