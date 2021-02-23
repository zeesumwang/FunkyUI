const loader = (function() {

	function loadBlob(url, callback) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState === XMLHttpRequest.DONE) {
				if (xmlhttp.status === 200) {
					callback(xmlhttp.response);
				} else if (xmlhttp.status == 400) {
					throw new Error('There was an error 400');
				} else {
					throw new Error('something else other than 200 was returned');
				}
			}
		};
		xmlhttp.open('GET', url, true);
		xmlhttp.responseType = 'arraybuffer';
		xmlhttp.send();
	}

	function loadText(url, callback) {

		var xmlhttp = new XMLHttpRequest();

		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == XMLHttpRequest.DONE) {
				if (xmlhttp.status == 200) {
					callback(xmlhttp.responseText);
				} else if (xmlhttp.status == 400) {
					throw new Error('There was an error 400');
				} else {
					throw new Error('something else other than 200 was returned');
				}
			}
		};

		xmlhttp.open('GET', url, true);
		xmlhttp.send();
	}

	function loadImage(url, callback) {

		const image = new Image();
		image.crossOrigin = true;

		image.onload = function() {
			callback(image);
		};

		image.src = url;
	}

	function loadImageQueue(urlMap, callback) {

		const len = Object.keys(urlMap).length;

		const imageMap = {};
		let i = 0;

		Object.keys(urlMap).forEach((k) => {

			const url = urlMap[k];

			loadImage(url, (image) => {

				imageMap[k] = image;

				i++;

				if (i === len) {
					callback(imageMap);
				}

			})

		})
	}

	function loadTextQueue(urls, callback) {

		let loadCount = 0;
		const res = [];

		urls.forEach((url, i) => {


			loadText(url, text => {
				res[i] = text;
				loadCount++;

				if (loadCount === urls.length) {
					callback(res);
				}

			});
		});
	}

	return {
		loadText,
		loadImage,
		loadBlob,
		loadImageQueue,
		loadTextQueue
	};
})();

function pbrAssets() {

	const prefix = '//g.alicdn.com/gama/assets/0.0.19/assets/pbr';

	function loadAssets(callback) {

		const faces = ['left', 'right', 'top', 'bottom', 'front', 'back'];

		loadSpecular(function(df) {
			loadDiffuse(function(sp) {
				loadBRDFLUT(function(lut) {
					callback(df, sp, lut);
				})
			})
		});

		function loadSpecular(callback) {
			const specularImages = {};
			faces.forEach((face, j) => {
				for (let i = 0; i < 10; i++) {
					specularImages[face + '_' + i] = `${prefix}/default/specular/specular_${face}_${i}.jpg`;
				}
			});

			loader.loadImageQueue(specularImages, function(images) {
				const data = {
					mip: []
				};
				Object.keys(images).forEach(k => {
					let [f, i] = k.split('_');
					i = Number(i);
					if (i === 0) {
						data[f] = images[k];
					} else {
						if (data.mip[i - 1] === undefined) {
							data.mip[i - 1] = {};
						}
						data.mip[i - 1][f] = images[k]
					}
				});
				callback(data);
			});
		}

		function loadDiffuse(callback) {

			const diffuseImages = {};

			faces.forEach((face, j) => {
				diffuseImages[face] = `${prefix}/default/diffuse/diffuse_${face}_0.jpg`;
			});

			loader.loadImageQueue(diffuseImages, function(images) {
				callback(images);
			})
		}

		function loadBRDFLUT(callback) {
			loader.loadImage('https://img.alicdn.com/tfs/TB1yCjuoDtYBeNjy1XdXXXXyVXa-256-256.png', callback);
		}
	}

	return {
		ready: callback => {
			loadAssets(callback)
		}
	}
}

function main() {
	var browser = {
	            versions: function() {
	                var u = navigator.userAgent, app = navigator.appVersion;
	                return {     //移动终端浏览器版本信息
	                    trident: u.indexOf('Trident') > -1, //IE内核
	                    presto: u.indexOf('Presto') > -1, //opera内核
	                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
	                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
	                    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
	                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
	                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
	                    iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
	                    iPad: u.indexOf('iPad') > -1, //是否iPad
	                    webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
	                };
	            } (),
	            language: (navigator.browserLanguage || navigator.language).toLowerCase()
	        }
			
	const container = document.querySelector('#app');

	const width = container.clientWidth;
	const height = container.clientHeight;
	console.log(container, width, height)
	const canvas = document.createElement('canvas');
	canvas.id = 'canvas'
	
	if (browser.versions.mobile) {
		canvas.width = width;
	}
	else{
		canvas.width = width * 1.55;
	}
	
	canvas.height = height;
	canvas.style.position = 'absolute';
	canvas.style.left = 0;
	canvas.style.top = 0;
	canvas.style.zIndex = -1;

	container.prepend(canvas);

	const engine = new G3D.Engine(canvas);

	const scene = new G3D.Scene(engine);

	const camera = new G3D.RotatePerspectiveCamera(scene);
	camera.alpha = 80;
	camera.beta = 0;
	camera.near = 0.001;
	camera.far = 10;
	
	//判断UA	
	if (browser.versions.mobile) {
		camera.radius = 3.8
		document.querySelector('.headerTitle').style.width = document.documentElement.clientWidth  + 'px';
		document.querySelector('.headerTitle').style.justifyContent = 'center'
		document.querySelector('.headerTitle').style.display = 'flex'
		document.querySelector('#top_context').style.position = 'absolute'
		document.querySelector('#top_context').style.top = '100px'
		document.querySelector('.header').style.height = document.documentElement.clientHeight * 0.3 + 'px';
		document.querySelector('#info').style.position = 'fixed'
		document.querySelector('#info').style.bottom = '100px'
	}
	else{
		camera.radius = 3.3;
		document.querySelector('.headerTitle').style.width = 0.3 * document.documentElement.clientWidth  + 'px';
		document.querySelector('.headerTitle').style.marginLeft = 0.2 * document.documentElement.clientWidth + 'px';
		document.querySelector('.headerTitle').style.display = 'flex'
		document.querySelector('.header').style.height = document.documentElement.clientHeight + 'px';
	}
	
	

	const light1 = new G3D.DirectionalLight(scene);
	light1.direction.x = 1;
	light1.direction.y = 1;
	light1.direction.z = 1;

	let meshes = [];

	pbrAssets().ready(function(specular, diffuse, lut) {

		loader.loadText(
			'//g.alicdn.com/gama/assets/0.0.16/assets/gltf/DamagedHelmet/DamagedHelmet.gltf.json',
			function(text) {

				const gltf = JSON.parse(text);
				let i = 0;

				gltf.buffers.forEach(buffer => {
					if (typeof buffer.uri === 'string') {
						buffer.uri = [buffer.uri];
					}
					loader.loadTextQueue(buffer.uri, textList => {
						const str = textList.join('');
						const arr = new Uint16Array(str.split(';').map(Number));
						buffer.data = arr.buffer;
						i++;
						check();
					});
				});
				gltf.images.forEach(image => {
					if (image.uri) {
						loader.loadImage(image.uri, imageData => {
							image.data = imageData;
							i++;
							check();
						});
					} else {
						i++;
						check();
					}
				});

				function check() {
					if (i === gltf.buffers.length + gltf.images.length) {
						init(gltf, {
							specular,
							diffuse,
							lut
						});
					}
				}
			});

		function init(gltf, {
			specular,
			diffuse,
			lut
		}) {

			const pbrEnv = new G3D.PBREnviroment({
				specular,
				diffuse,
				brdfLUT: lut
			});

			meshes = G3D.MeshBuilder.createMeshFromGLTF(scene, gltf, pbrEnv);
			
			new G3D.Skybox(scene, diffuse, 5.4);

			meshes.forEach(m => {
				m.rotation.y = 225;
			});
		}
	});

	let hover = false;
	let speed = 0.1;

	let targetY = 0;
	let currentY = 0;

	document.querySelector('.banner').addEventListener('mousemove', function(e) {
		const {
			offsetX,
			offsetY
		} = e;
		const id = scene.pick(offsetX, offsetY);
		targetY = (offsetY / height) * 2 - 1;
		if (meshes[0] && id === meshes[0].id) {
			// console.log("暂停旋转")
			hover = true;
		} else {
			hover = false;
		}
	});

	function render() {
		if (meshes) {
			if (hover) {
				speed = Math.max(speed - 0.01, 0);
			} else {
				speed = Math.min(0.05, speed + 0.005);
			}
			if (Math.abs(currentY - targetY) > 0.05) {
				currentY += (targetY - currentY) / 5;
			}
			camera.beta = currentY * 3;
			meshes.forEach(m => {
				m.rotation.y += speed;
			});
		}
		meshes.forEach(m => {
			m.rotation.y += speed;
		});
		scene.render();
		requestAnimationFrame(render);
	}
	render();

}

// setTimeout(main, 10);
main()
