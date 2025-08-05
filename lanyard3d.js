// Inisialisasi Three.js
document.addEventListener('DOMContentLoaded', () => {
    // Dapatkan container dan section about
    const container = document.getElementById('lanyard-container');
    const aboutSection = document.getElementById('about');
    
    if (!container || !aboutSection) {
        console.error('Required elements not found!');
        return;
    }

    // Buat scene
    const scene = new THREE.Scene();
    scene.background = null;

    // Setup kamera
    const camera = new THREE.PerspectiveCamera(
        45, // FOV
        container.clientWidth / container.clientHeight, // Aspect ratio
        0.1, // Near clipping plane
        1000 // Far clipping plane
    );
    camera.position.z = 5; // Posisi kamera

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true, // Transparan
        antialias: true // Anti-aliasing
    });
    renderer.shadowMap.enabled = true;
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.innerHTML = ''; // Hapus konten sebelumnya
    container.appendChild(renderer.domElement);

    // Tambahkan style ke container
    container.style.borderRadius = '1rem';
    container.style.overflow = 'hidden';
    container.style.boxShadow = '0 10px 30px -10px rgba(0, 0, 0, 0.3)';
    container.style.cursor = 'grab';  // Menambahkan kursor grab untuk interaksi yang lebih jelas
    
    // Aktifkan akselerasi GPU untuk performa yang lebih baik
    container.style.transform = 'translateZ(0)';
    renderer.domElement.style.willChange = 'transform';

    // Tambahkan pencahayaan
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 2);
    scene.add(directionalLight);

    // Inisialisasi texture loader
    const textureLoader = new THREE.TextureLoader();
    
    // Buat group untuk menampung semua elemen foto
    const photoGroup = new THREE.Group();
    scene.add(photoGroup);
    
    // Buat geometry untuk foto
    const photoGeometry = new THREE.PlaneGeometry(3, 4.5);
    
    // Buat material default sementara
    const tempMaterial = new THREE.MeshPhongMaterial({
        color: 0x888888,
        side: THREE.DoubleSide,
        specular: 0x111111,
        shininess: 30
    });
    
    // Buat material untuk foto kedua (adi.jpg)
    const backPhotoMaterial = new THREE.MeshPhongMaterial({
        side: THREE.BackSide,
        specular: 0x111111,
        shininess: 30
    });
    
    // Buat mesh untuk foto kedua (di belakang)
    const backPhoto = new THREE.Mesh(photoGeometry, backPhotoMaterial);
    backPhoto.position.z = -0.1; // Geser sedikit ke belakang
    backPhoto.rotation.y = 0; // Tidak perlu rotasi tambahan
    photoGroup.add(backPhoto);
    
    // Buat mesh untuk foto utama
    const photo = new THREE.Mesh(photoGeometry, tempMaterial);
    photo.position.z = 0.1; // Geser sedikit ke depan
    photoGroup.add(photo);
    
    // Buat frame 3D
    const frameThickness = 0.1;
    const frameWidth = 3.2;
    const frameHeight = 4.7;
    
    // Material untuk frame
    const frameMaterial = new THREE.MeshPhongMaterial({
        color: 0x333333,
        side: THREE.DoubleSide,
        specular: 0x444444,
        shininess: 50
    });
    
    // Buat frame depan
    const frameFront = new THREE.Mesh(
        new THREE.BoxGeometry(frameWidth, frameHeight, frameThickness),
        frameMaterial
    );
    frameFront.position.z = 0;
    photoGroup.add(frameFront);
    
    // Kedalaman untuk foto belakang
    const backDepth = 0.1;
    const backGeometry = new THREE.PlaneGeometry(3, 4.5);
    
    // Material untuk bagian belakang (sementara)
    const tempBackMaterial = new THREE.MeshPhongMaterial({
        color: 0x111111,
        side: THREE.DoubleSide,
        specular: 0x222222,
        shininess: 20
    });
    
    // Buat mesh untuk foto belakang
    const back = new THREE.Mesh(backGeometry, tempBackMaterial);
    back.position.z = -backDepth;
    back.rotation.y = Math.PI; // Putar 180 derajat
    photoGroup.add(back);
    
    // Path ke foto formal
    const imagePath = './assets/foto formal.jpg';
    // Variabel untuk interaksi
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotation = { x: 0, y: 0 };
    let currentRotation = { x: 0, y: 0 };
    // Muat texture untuk foto utama
    const mainImagePath = 'assets/foto formal.jpg';
    const backImagePath = 'assets/adi.jpg';
    
    // Loader untuk foto utama
    textureLoader.load(
        mainImagePath,
        // onLoad callback
        function(texture) {
            console.log('Foto utama berhasil dimuat');
            // Update material foto dengan texture yang sudah dimuat
            photo.material = new THREE.MeshPhongMaterial({
                map: texture,
                side: THREE.DoubleSide,
                specular: 0x111111,
                shininess: 30
            });
            
            // Setelah foto utama dimuat, muat foto kedua
            textureLoader.load(
                backImagePath,
                function(backTexture) {
                    console.log('Foto belakang berhasil dimuat');
                    // Update material foto belakang
                    backPhoto.material = new THREE.MeshPhongMaterial({
                        map: backTexture,
                        side: THREE.BackSide,
                        specular: 0x111111,
                        shininess: 30
                    });
                    // Balik gambar secara horizontal
                    backTexture.wrapS = THREE.RepeatWrapping;
                    backTexture.repeat.x = -1; // Membalik tekstur secara horizontal
                },
                function(xhr) {
                    console.log('Memuat foto belakang: ' + (xhr.loaded / xhr.total * 100) + '%');
                },
                function(error) {
                    console.error('Error loading back texture:', error);
                }
            );
        },
        // onProgress callback (opsional)
        function(xhr) {
            console.log('Memuat foto utama: ' + (xhr.loaded / xhr.total * 100) + '%');
        },
        // onError callback
        function(error) {
            console.error('Error loading main texture:', error);
        }
    );

    // Fungsi untuk memeriksa apakah mouse berada di section about
    function isMouseInAboutSection(clientX, clientY) {
        const rect = aboutSection.getBoundingClientRect();
        return (
            clientX >= rect.left &&
            clientX <= rect.right &&
            clientY >= rect.top &&
            clientY <= rect.bottom
        );
    }

    // Variabel untuk melacak posisi mouse
    let isMouseInContainer = false;

    // Event listener untuk mouse move
    document.addEventListener('mousemove', (e) => {
        // Cek apakah mouse berada di dalam container
        const rect = container.getBoundingClientRect();
        const isInContainer = 
            e.clientX >= rect.left && 
            e.clientX <= rect.right && 
            e.clientY >= rect.top && 
            e.clientY <= rect.bottom;

        // Update status mouse
        if (isInContainer !== isMouseInContainer) {
            isMouseInContainer = isInContainer;
            container.style.cursor = isMouseInContainer ? 'grab' : 'default';
            if (!isMouseInContainer) {
                targetRotation = { x: 0, y: 0 };  // Reset rotasi saat keluar container
            }
        }

        // Jika mouse di dalam container, update rotasi
        if (isMouseInContainer) {
            // Hitung posisi relatif terhadap tengah container
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Hitung jarak dari tengah (nilai antara -1 dan 1)
            const deltaX = (e.clientX - centerX) / (rect.width / 2);
            const deltaY = (e.clientY - centerY) / (rect.height / 2);
            
            // Atur rotasi target untuk rotasi 360 derajat
            // Kalikan dengan Math.PI untuk konversi ke radian (180 derajat = Math.PI radian)
            targetRotation.y = deltaX * Math.PI;  // Rotasi horizontal penuh (360 derajat)
            targetRotation.x = -deltaY * (Math.PI / 2);  // Rotasi vertikal 180 derajat
        }
    });

    // Fungsi animasi
    function animate() {
        requestAnimationFrame(animate);
        
        // Gunakan easing yang lebih halus untuk rotasi 360 derajat
        const easing = 0.15; // Mengurangi kecepatan easing untuk gerakan yang lebih halus
        currentRotation.x += (targetRotation.x - currentRotation.x) * easing;
        currentRotation.y += (targetRotation.y - currentRotation.y) * easing;
        
        // Terapkan rotasi ke photoGroup
        if (photoGroup) {
            // Normalisasi rotasi untuk memastikan nilai tetap dalam rentang -PI sampai PI
            photoGroup.rotation.x = currentRotation.x;
            photoGroup.rotation.y = currentRotation.y;
            
            // Tambahkan rotasi otomatis yang halus untuk efek yang lebih dinamis
            // photoGroup.rotation.y += 0.002; // Uncomment baris ini untuk menambahkan rotasi otomatis
        }
        
        // Render scene
        renderer.render(scene, camera);
    }
    
    // Mulai animasi
    animate();

    // Handle resize window
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
});