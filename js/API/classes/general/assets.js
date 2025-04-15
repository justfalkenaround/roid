'use strict';

/*------ASSETS CLASS FOR PROPER LOADING OF ASSETS------*/
class Assets extends Interface {
    constructor(id) {
        super(id);
        this.assets = [];
        this.assetsStillLoading = 0;
        this.assetCount = 0;
    }

    /*------LOAD IMAGE OR AUDIO ASSET------*/
    load(src, type, id = this.assetCount) {
        if (type === 'AUDIO') {
            this.assetCount++;
            this.assetsStillLoading++;
            fetch(src).then((res1) => {
                res1.arrayBuffer().then((res2) => {
                    this.parent.audioManager.audioContext.decodeAudioData(res2).then((res3) => {
                        this.assetsStillLoading--;
                        this.assets.push({ buffer: res3, id: id });
                    });
                });
            });
        }
        else if (type === 'IMAGE') {
            const asset = new Image();
            asset.src = src;
            this.assetsStillLoading++;
            asset.addEventListener('load', () => {
                this.assetsStillLoading--;
            });
            this.assets.push(asset);
            return asset;
        }
    }

    /*------FIND THE ASSET BY IT'S ID------*/
    find(id) {
        for (let i = 0; i < this.assets.length; i++) {
            if (this.assets[i].id === id) {
                return this.assets[i].buffer;
            }
        }
    }

    /*------WAIT TO CONTINUE UNTIL ALL ASSETS HAVE LOADED------*/
    wait(callBack) {
        if (this.assetsStillLoading === 0) {
            callBack();
        }
        else {
            window.requestAnimationFrame(() => {
                this.wait(callBack);
            });
        }
    }
}