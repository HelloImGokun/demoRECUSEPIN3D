import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Configs')
export class Configs {
    //
    //public static 
    //string constant
    public static DOOR_NAME:string ='Door';
    public static PIN_NAME: string = 'pin';
    public static LOAD_LEVEL_PATH = 'level/lv';
    public static PLAYER_PREFAB_PATH = 'character/';
    public static SPIKE_PREFABS:string = 'Spike'
    public static KILL_PLAYER_OBJ = 'obj_kill';
    public static KILL_ALL_OBJ = 'obj_kill_all';
}


