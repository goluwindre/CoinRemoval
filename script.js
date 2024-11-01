const canvas = document.getElementById('puzzle');;
const ctx = canvas.getContext('2d');
let side = 4; // 4x4グリッド
let grid = side*side;
const padding = 0; // 円同士の余白
let circleRadius = (canvas.width / side - padding) / 2; // 円の半径

var select = document.getElementById('side_num');
var message = document.getElementById('message');


let coins = [];

function drawCoins() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (let row = 0; row < side; row++) {
		for (let col = 0; col < side; col++) {
			var coin = coins[row * side + col];
			if (coin !== null) {
				let x = col * (circleRadius * 2 + padding) + circleRadius + padding / 2;
                let y = row * (circleRadius * 2 + padding) + circleRadius + padding / 2;

				ctx.beginPath();
				ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
				ctx.closePath();
				if(coin == "H"){
					ctx.fillStyle = '#228B22';
				}else if(coin == "T"){
					ctx.fillStyle = '#ff0000';
				}else{
					ctx.fillStyle = '#fffffff';
				}
				
				ctx.fill();
				ctx.strokeStyle = '#000000';
                ctx.stroke();

				ctx.fillStyle = '#ffffff';
				ctx.font = '24px Arial';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillText(coin, x, y);
			}
		}
	}
}

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

// クリックされた座標をチェック
function coordCoin(x, y){
	for(let i=0; i<side; i++){
		let min = i * 2 * circleRadius;
        let max = (i + 1) * 2 * circleRadius;
		var ro, co;
		if(x >= min && x< max){
			co = i;
		}

		if(y >= min && y < max){
			ro = i;
		}
	}
	return {ro, co};
}

function flipCoin(ro, co){

	// 取り除いた硬貨の上の硬貨をひっくり返す場合
	if(ro > 0){
		if(coins[side*(ro-1)+co] == "H"){
			coins[side*(ro-1)+co] = "T";
		}else if(coins[side*(ro-1)+co] == "T"){
			coins[side*(ro-1)+co] = "H";
		}
	}
	if(ro < side-1){ // 下の硬貨をひっくり返す場合
		if(coins[side*(ro+1)+co] == "H"){
			coins[side*(ro+1)+co] = "T";
		}else if(coins[side*(ro+1)+co] == "T"){
			coins[side*(ro+1)+co] = "H";
		}
	}
	if(co > 0){ // 左の硬貨をひっくり返す場合
		if(coins[side*ro+co-1] == "H"){
			coins[side*ro+co-1] = "T";
		}else if(coins[side*ro+co-1] == "T"){
			coins[side*ro+co-1] = "H";
		}
	}
	if(co < side-1){// 右の硬貨をひっくり返す場合
		if(coins[side*ro+co+1] == "H"){
			coins[side*ro+co+1] = "T";
		}else if(coins[side*ro+co+1] == "T"){
			coins[side*ro+co+1] = "H";
		}
	}
}

// 硬貨を取り除く関数
function removeCoin(ro, co){
	var remove = side*ro + co;
	if(coins[remove] == "H"){
		coins[remove] = "";
		flipCoin(ro, co);
		drawCoins();
	}

}

// 左上の硬貨は常に表にしておく
// (四隅の硬貨が全て裏である場合、取り除けないため)
function coinsCheck(){
	if(coins[0] == "T"){
		coins[0] = "H";
		for(var i=1; i<grid; i++){
			if(coins[i] == "H"){
				coins[i] = "T";
				break;
			}
		}
	}
}

function gameCheck(){
	var heads = 0;
	var tails = 0;
	for(var i=0; i<grid; i++){
		if(coins[i] == "H"){
			heads++;
		}else if(coins[i] == "T"){
			tails++;
		}
	}

	if((heads==0)&&(tails>0)){
		message.textContent = "GAME OVER";
	}

	if((heads==0)&&(tails==0)){
		message.textContent = "GAME CLEAR";
	}
}

function init(){

	coins =[];
	
	let head_num = Math.ceil(Math.random()*grid);
	if (head_num % 2 != side % 2){
		head_num = head_num + 1;
	}

	console.log("head_num", head_num);
	for(var i=0; i<grid; i++){
		if(i < head_num){
			coins.push('H');
		}else{
			coins.push('T');
		}
	}

	shuffle(coins);
	coinsCheck();
	drawCoins();
}

function gameStart(){
	message.textContent = "GAME START";
	console.log("circleRadius", circleRadius);

	select.onchange = function(){
		side = Number(this.value);
		grid = side*side;
		circleRadius = (canvas.width / side - padding) / 2;
	}
	
	init();
	console.log(coins);
}

canvas.addEventListener('click', (e) => {
	const rect = canvas.getBoundingClientRect(); // キャンバスの位置とサイズ
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;
	let coord = coordCoin(x, y);
	removeCoin(coord.ro, coord.co);
	gameCheck();
	
});



gameStart();