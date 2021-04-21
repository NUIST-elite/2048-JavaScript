// 历史最高分
const BestScoreKey = '2048BestScore';
// 方格状态和分数
const CellStateKey = '2048CellState';

function Storage() {}

Storage.prototype.setBestScore = function(bestScore) {
  window.localStorage.setItem(BestScoreKey, bestScore);
};

Storage.prototype.getBestScore = function() {
  return window.localStorage.getItem(BestScoreKey);
};

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
