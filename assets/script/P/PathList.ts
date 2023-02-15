import { _decorator, Component } from 'cc';
import { PointNode } from './PointNode';
const { ccclass, property } = _decorator;

@ccclass('PathList')
export class PathList extends Component {
    @property(PointNode)
    private pointList:PointNode[]=[];
    start() {

    }
    getPointList(){
        console.log(this.node.name,this.pointList.length);
        return this.pointList;
    }
}


