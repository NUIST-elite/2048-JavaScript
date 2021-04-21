# 2048-JavaScript

## 项目概述

该项目是基于手机端热门小游戏2048，使用html+css+Javascript开发的网页版2048小游戏



## 项目主要功能点介绍及代码实现解析

1. 游戏是一个**4x4**的方格，将每一个方格称作一个**Cell**或者**Tile**，在tile.js,gril.js中定义该对象

   ```js
   function Tile(position, value) {
     this.row = position.row; // 行
     this.column = position.column; // 列
     this.value = value; // 值
   
     // 新增prePosition属性
     this.prePosition = null;
     // 存储merged两个Tile
     this.mergedTiles = null;
   }
   
   //grid.js
   function Grid(size = 4, state) {
     this.size = size;
     this.cells = [];
     this.init(size);
     // 如果有之前的进度，则恢复
     if (state) {
       this.recover(state);
     }
   }
   ```

2. 游戏开始能随机出现 2 个 **Tile**,每个的值 90%可能为 2，10%可能为 4, 在render.js写渲染相关的逻辑

   ```js
   // 渲染整个grid
   Render.prototype.render = function(grid, { score, status, bestScore }) {
     this.empty();
     this.renderScore(score);
     this.renderBestScore(bestScore);
     this.renderStatus(status);
     for (let row = 0; row < grid.size; row++) {
       for (let column = 0; column < grid.size; column++) {
         // 如果grid中某个cell不为空，则渲染这个cell
         if (grid.cells[row][column]) {
           this.renderTile(grid.cells[row][column]);
         }
       }
     }
   };
   ```

   根据概率在manage,js中实现生成逻辑

   ```js
   // 随机添加一个节点
   Manager.prototype.addRandomTile = function() {
     const position = this.grid.randomAvailableCell();
     if (position) {
       // 90%概率为2，10%为4
       const value = Math.random() < 0.9 ? 2 : 4;
       // 随机一个方格的位置
       const position = this.grid.randomAvailableCell();
       // 添加到grid中
       this.grid.add(new Tile(position, value));
     }
   };
   ```

   

3. 可以通过上、下、左、右键盘操作,每个 Tile 按照方向移动到不可移动为止

   在listen.js实现通过键盘移动Tile

   ```js
   function Listener({ move: moveFn, start: startFn }) {
     window.addEventListener('keyup', function(e) {
       switch (e.keyCode) {
         case 38:
           moveFn({ row: -1, column: 0 });
           break;
         case 37:
           moveFn({ row: 0, column: -1 });
           break;
         case 39:
           moveFn({ row: 0, column: 1 });
           break;
         case 40:
           moveFn({ row: 1, column: 0 });
           break;
       }
     });
   ```

   在grid.js中封装是否越界的判断方法

   ```js
   // 判断某个位置是否超出边界
   Grid.prototype.outOfRange = function(position) {
     return (
       position.row < 0 ||
       position.row >= this.size ||
       position.column < 0 ||
       position.column >= this.size
     );
   };
   ```

   

4. 如果移动后相遇的两个Tile的值相同，则将他们合并，在manager.js中实现移动的核心逻辑

   ```js
   // 移动核心逻辑
   Manager.prototype.listenerFn = function(direction) {
     // 定义一个变量，判断是否引起移动
     let moved = false;
   
     const { rowPath, columnPath } = this.getPaths(direction);
     for (let i = 0; i < rowPath.length; i++) {
       for (let j = 0; j < columnPath.length; j++) {
         const position = { row: rowPath[i], column: columnPath[j] };
         const tile = this.grid.get(position);
         if (tile) {
           // 当此位置有Tile的时候才进行移动
           const { aim, next } = this.getNearestAvaibleAim(position, direction);
   
           // 区分合并和移动，当next值和tile值相同的时候才进行合并
           if (next && next.value === tile.value) {
             // 合并位置是next的位置，合并的value是tile.value * 2
             const merged = new Tile(
               {
                 row: next.row,
                 column: next.column
               },
               tile.value * 2
             );
   
             this.score += merged.value;
             //将合并以后节点，加入grid
             this.grid.add(merged);
             //在grid中删除原始的节点
             this.grid.remove(tile);
             //判断游戏是否获胜
             if (merged.value === this.aim) {
               this.status = 'WIN';
             }
             merged.mergedTiles = [tile, next];
             tile.updatePosition({ row: next.row, column: next.column });
             moved = true;
           } else {
             this.moveTile(tile, aim);
             moved = true;
           }
         }
       }
     }
   ```

   

5. 顶部的Score记录当前分数，BestScore记录历史最高分，在storage.js中实现

   ```js
   // 存储方格状态和分数
   Storage.prototype.setCellState = function({ score, grid }) {
     window.localStorage.setItem(
       CellStateKey,
       JSON.stringify({
         score,
         grid: grid.serialize()
       })
     );
   };
   
   // 获取方格信息
   Storage.prototype.getCellState = function() {
     const cellState = window.localStorage.getItem(CellStateKey);
     return cellState ? JSON.parse(cellState) : null;
   };
   ```



## 项目总结

虽然技术点并不多，但对JavaScript的要求较高，而且无论在代码量还是数学判断逻辑上都有一定难度。

在项目过程中，使用scss拆分了css文件，并深入利用JavaScript面向对象编程的思想，将整个项目的js进行了划分，并按照静态页面,模型建立,移动处理,合并处理,动画效果,缓存效果进度一步一步深入进行，最终完成了这个项目。