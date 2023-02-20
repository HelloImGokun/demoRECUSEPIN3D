import { _decorator, Component, Node, animation, RigidBody, Vec3, tween, Quat, ITriggerEvent, Collider, ICollisionEvent, BoxCollider } from 'cc';
import { Configs } from '../utils/Configs';
import { LevelController } from './controller/LevelController';
import { PointNode } from './P/PointNode';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property(animation.AnimationController)
    private animationController: animation.AnimationController;
    @property(RigidBody)
    private rigidBody: RigidBody;
    private oldX = null;
    private newX = null;
    private oldZ = null;
    private newZ = null;

    //check door
    private isFindDoor: boolean = false;
    private levelController: LevelController;
    //check xem player da die or win
    private isOver:boolean = false;
    start() {
        //get LevelController
        this.levelController = this.node.parent?.getComponent(LevelController);
        let collider = this.getComponent(Collider);
        collider.on('onTriggerEnter', this.onTriggerEnter, this);
        collider.on('onTriggerExit', this.onTriggerExit, this);
        this.findPath();

    }
    //
    isFind: boolean = false;
    //FindPath
    public findPath() {
        //lap qua path list de tim duong
        //
        if (this.isFind) return;
        if(this.isOver) return;

        //
        let pathList = this.levelController.getPathList();
        for (let i = 0; i < pathList.length; i++) {
            //trong cac point list
            let pointListObject = pathList[i];
            let pointList = pointListObject.getPointList();

            //tim duong va kiem tra, neu co duong roi thi thoat for
        
            if (this.checkPointList(pointList)) {
                //
                this.isFind = true;
                //
                return this.movePlayerThroughThePointList(pointList);
            }
        }

    }
    private checkPointList(pointList) {
        for (let i = 0; i < pointList.length; i++) {
            if (pointList[i].getIsLock()) {
                console.log('Cannot pass');
                return false;
            }
        }
        //
        return true;
        //

    }
    // z luon bang 0
    private convertPositionToPlayerY(playerPos,pointPos){
        return new Vec3(pointPos.x,playerPos.y,0);
    }
    private movePlayerThroughThePointList(pointList) {
        //p1 - p2
        //nhan vat khi di chuyen thi y ko doi = y cua nhan vat hien tai

        let pointCount = 0;
        //b1: check diem pointCount neu co => thuc hien buoc di
        //b2: Thuc hien buoc di xong lap lai b1
        const moveToPoint = (position)=>{
            let newPosition = this.convertPositionToPlayerY(this.node.position,position);
            //do move
            tween(this.node).sequence(
                tween(this.node).to(0.5, { position:newPosition}),
                tween(this.node).delay(1),
                tween().call(()=>{
                    //retrack check tiep xem co di chuyen tiep den diem sau ko
                    pointCount++;
                    //check point again

                    checkPoint();
                })
            ).start();
        }
        const checkPoint = ()=>{
            console.log('p:'+pointList[pointCount]);
            if(pointList[pointCount]){
                moveToPoint(pointList[pointCount].getPosition());
            }
        }
        //
        checkPoint();
        //from 1 - 2 - 3
    }
    //
    //check touch door
    private onTriggerEnter(event: ITriggerEvent) {
        //
   
        if(this.isOver) return;
        //
        let collisionNode: Node = event.otherCollider.node;
        console.log('collider',collisionNode.name);
        //check player dat chan xuong mat dat hay chua
        if(collisionNode.name.includes(Configs.FLOOR_GROUND_NAME)||collisionNode.name.includes(Configs.DOOR_NAME)){
            //player roi xuong mat dat
            this.animationController.setValue('landed',true);
        }
        if (!this.isFindDoor) {
            //1. check door
            if (collisionNode.name.includes(Configs.DOOR_NAME)) {
                this.findDoor();
            }
            //cham vao enemy la die
            else if (collisionNode.name.includes(Configs.KILL_PLAYER_OBJ)||collisionNode.name.includes(Configs.KILL_ALL_OBJ)){
                this.animationController.setValue('isDie',true);
                this.isOver = true;
                //delay for a second
                this.scheduleOnce(()=>{
                    //lose game
                    let LevelControllerNode = this.node.getParent();
                    if (LevelControllerNode.getComponent(LevelController)) {
                        LevelControllerNode.getComponent(LevelController).loseGame();
                    }
                },2)
            }
        }
       
       
    }
    private onTriggerExit(event: ITriggerEvent){
        //check xem player da thoat khoi mat dat chua
        //
        if(this.isOver) return;
        if(event.otherCollider.name.includes(Configs.FLOOR_GROUND_NAME)){
            //player roi tu do
            this.animationController.setValue('onair',true);
        }
    }
    private findDoor() {
        if (this.isFindDoor) return;
        this.isFindDoor = true;
       
        tween(this.node).sequence(
            //xoay nguoi lai huong door
            tween(this.node).delay(0.5),
            tween(this.node).to(0.2, { eulerAngles: new Vec3(0, 180, 0) }),
            tween(this.node).by(0.5, { position: new Vec3(0, 0, -0.4) }),
            //xoay nguoi huong ra ngoai 
            tween(this.node).to(0.2, { eulerAngles: new Vec3(0, 0, 0) }),
            tween(this.node).call(() => {
                //do win animation;
                this.animationController.setValue('win', true);

                // setTimeout(() => {
                //     this.animationController.setValue('win',false);
                // }, 1000);
            }),
            tween(this.node).delay(1),
            tween(this.node).call(() => {
                this.openDoorSuccess();
            })
        ).start();
    }
    private openDoorSuccess() {
        //win
        //get level manager
        let LevelControllerNode = this.node.getParent();
        if (LevelControllerNode.getComponent(LevelController)) {
            LevelControllerNode.getComponent(LevelController).winLevel();
        }

    }

    //
    update(deltaTime: number) {
        //check run
        this.checkRun();

        //
    }


    private checkRun() {
        if (this.oldX == null) {
            this.oldX = this.node.position.x;
        } else {
            this.newX = this.node.position.x;
            let deltaX = this.newX - this.oldX
            //check left or right
            this.checkMoveLeftOrRight(deltaX);
            this.animationController.setValue('dx', Math.abs(deltaX));
            //console.log('dx',deltaX);
            this.oldX = this.newX;
        }
        //check z


        if (this.oldZ == null) {
            this.oldZ = this.node.position.z;
        } else {
            this.newZ = this.node.position.z;
            let deltaZ = this.newZ - this.oldZ
            //check left or right
            this.animationController.setValue('dz', Math.abs(deltaZ));
            //console.log('dx',deltaX);
            this.oldZ = this.newZ;
        }


    }
    private checkMoveLeftOrRight(deltaX) {
       
        if (deltaX > 0.001) {
            //move right
            console.log('move right');
            this.node.setRotationFromEuler(new Vec3(0, 90, 0));
        } else if (deltaX < -0.001) {
            console.log('move left');
            //move left
            this.node.setRotationFromEuler(new Vec3(0, -90, 0));
        }
    }
    //

}


