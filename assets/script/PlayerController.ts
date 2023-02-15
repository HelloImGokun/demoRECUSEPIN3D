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
    private oldY = null;
    private newY = null;
    private oldX = null;
    private newX = null;
    private oldZ = null;
    private newZ = null;

    //check door
    private isFindDoor: boolean = false;
    private levelController: LevelController;
    start() {
        //get LevelController
        this.levelController = this.node.parent?.getComponent(LevelController);
        let collider = this.getComponent(Collider);
        collider.on('onTriggerEnter', this.onTriggerEnter, this);
        this.findPath();

    }
    //
    isFind: boolean = false;
    //FindPath
    public findPath() {
        //lap qua path list de tim duong
        //
        if (this.isFind) return;

        //
        let pathList = this.levelController.getPathList();
        for (let i = 0; i < pathList.length; i++) {
            //trong cac point list
            let pointListObject = pathList[i];
            let pointList = pointListObject.getPointList();

            //tim duong va kiem tra, neu co duong roi thi thoat for
            if (this.checkPointList(pointList)) {
                //
                console.log('Let pass');
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
    private movePlayerThroughThePointList(pointList) {
        //p1 - p2
        for (let i = 0; i < pointList.length; i++) {
            tween(this.node).sequence(
                tween(this.node).delay(i * 2),
                tween(this.node).to(1, { position: pointList[i].getPosition() })
            ).start();

        }
        //from 1 - 2 - 3
    }
    //
    //check touch door
    private onTriggerEnter(event: ITriggerEvent) {
        //
        let collisionNode: Node = event.otherCollider.node;
        console.log(collisionNode.name);
        if (!this.isFindDoor) {
            //1. check door
            if (collisionNode.name.includes(Configs.DOOR_NAME)) {
                this.findDoor();
            }
            //cham vao enemy la die
            else if (collisionNode.name.includes(Configs.ENEMY_NAME)){
                this.animationController.setValue('Die',true);
            }
        }
       
       
    }
    private findDoor() {
        if (this.isFindDoor) return;
        this.isFindDoor = true;
        console.log('find door');
        tween(this.node).sequence(
            //xoay nguoi lai huong door
            tween(this.node).delay(0.5),
            tween(this.node).to(0.2, { eulerAngles: new Vec3(0, 180, 0) }),
            tween(this.node).by(0.5, { position: new Vec3(0, 0, -0.5) }),
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
        //check on air
        this.checkOnAir();

        //check run
        this.checkRun();

        //
    }
    private checkOnAir() {
        this.newY = this.node.position.y;
        if (this.oldY == null) {
            this.oldY = this.newY;
        } else {
            let deltaY = (Math.abs(this.newY - this.oldY));

            this.animationController.setValue('dy', deltaY);
            this.oldY = this.newY;
        }
    }

    private checkRun() {
        this.newX = this.node.position.x;
        if (this.oldX == null) {
            this.oldX = this.node.position.x;
        } else {
            let deltaX = this.newX - this.oldX
            //check left or right
            this.checkMoveLeftOrRight(deltaX);
            this.animationController.setValue('dx', Math.abs(deltaX));
            //console.log('dx',deltaX);
            this.oldX = this.newX;
        }
        //check z

        this.newZ = this.node.position.z;
        if (this.oldZ == null) {
            this.oldZ = this.node.position.z;
        } else {
            let deltaZ = this.newZ - this.oldZ
            //check left or right
            this.animationController.setValue('dz', Math.abs(deltaZ));
            //console.log('dx',deltaX);
            this.oldZ = this.newZ;
        }


    }
    private checkMoveLeftOrRight(deltaX) {
        if (deltaX > 0) {
            //move right
            this.node.setRotationFromEuler(new Vec3(0, 90, 0));
        } else if (deltaX < 0) {
            //move left
            this.node.setRotationFromEuler(new Vec3(0, -90, 0));
        }
    }
    //

}


