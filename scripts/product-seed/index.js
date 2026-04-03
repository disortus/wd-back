/**
 * Product Seed Script
 * Creates sample products for each category and subcategory
 */

const BASE_URL = "http://localhost:5000/api";

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m"
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  log(`\n${"=".repeat(60)}`, "cyan");
  log(`  ${title}`, "cyan");
  log("=".repeat(60), "cyan");
}

async function apiRequest(method, endpoint, data = null, token = null) {
  const headers = {
    "Content-Type": "application/json"
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const options = {
    method,
    headers
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const result = await response.json();
    return { success: response.ok, data: result, status: response.status };
  } catch (error) {
    log(`  Error: ${error.message}`, "red");
    return { success: false, error: error.message };
  }
}

// Sample image URLs (using placeholder images)
const SAMPLE_IMAGES = {
  iphone: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-black-titanium-select-202309",
  ipad: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-model-select-gallery-2-202210",
  macbook: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-15-midnight-select-202306",
  watch: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-series-9-cellular-nc-alum-41mm-starlight-nc-cellular-select-202409",
  airpods: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-pro-2nd-gen-202209",
  mac: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mac-mini-202301",
  monitor: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/studio-display-gallery-1-202203",
  charger: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/magsafe-charger-202308",
  cable: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ios-17-airpods-pro-2nd-gen-img",
  case: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-clear-case-202309",
  adapter: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/usb-c-digital-av-multipord-adapter-gallery-1-202207",
  keyboard: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/magic-keyboard-black-202104",
  mouse: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/magic-mouse-black-202104",
  pencil: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/apple-pencil-2nd-gen-202311",
  hub: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-15-m2-202306"
};

// Product templates for each subcategory
const PRODUCT_TEMPLATES = {
  // Electronics - Smartphones
  smartphones: [
    {
      title: "iPhone 16 Pro",
      description: "iPhone 16 Pro with A18 Pro chip. Built for Apple Intelligence. The titanium design is light and strong, with a larger display and the thinnest borders ever on iPhone.",
      price: 649990,
      stock: 15,
      images: ["https://example.com/iphone16-pro.jpg"],
      mainImage: "https://example.com/iphone16-pro.jpg",
      attributes: {
        display: "Super Retina XDR 6.3-inch",
        display_size: 6.3,
        processor: "A18 Pro",
        battery: 4685,
        storage: 256,
        ram: 8,
        camera_main: "48MP Fusion",
        camera_front: "12MP TrueDepth",
        sim_type: "Dual SIM (Nano + eSIM)",
        color: "Black Titanium",
        weight: 199,
        water_resistance: "IP68"
      }
    },
    {
      title: "iPhone 16 Pro Max",
      description: "iPhone 16 Pro Max. A massive leap in battery life with A18 Pro and the titanium design.",
      price: 749990,
      stock: 10,
      images: ["https://example.com/iphone16-pro-max.jpg"],
      mainImage: "https://example.com/iphone16-pro-max.jpg",
      attributes: {
        display: "Super Retina XDR 6.9-inch",
        display_size: 6.9,
        processor: "A18 Pro",
        battery: 4685,
        storage: 256,
        ram: 8,
        camera_main: "48MP Fusion",
        camera_front: "12MP TrueDepth",
        sim_type: "Dual SIM (Nano + eSIM)",
        color: "Natural Titanium",
        weight: 227,
        water_resistance: "IP68"
      }
    },
    {
      title: "iPhone 16",
      description: "iPhone 16. Built for Apple Intelligence. The new camera system with 48MP camera captures stunning photos and videos.",
      price: 549990,
      stock: 20,
      images: ["https://example.com/iphone16.jpg"],
      mainImage: "https://example.com/iphone16.jpg",
      attributes: {
        display: "Super Retina XDR 6.1-inch",
        display_size: 6.1,
        processor: "A18",
        battery: 3561,
        storage: 128,
        ram: 8,
        camera_main: "48MP Fusion",
        camera_front: "12MP TrueDepth",
        sim_type: "Dual SIM (Nano + eSIM)",
        color: "Black",
        weight: 170,
        water_resistance: "IP68"
      }
    }
  ],

  // Electronics - Laptops
  laptops: [
    {
      title: "MacBook Pro 14-inch M4",
      description: "MacBook Pro M4. Built for Apple Intelligence. The most powerful MacBook Pro ever with M4, M4 Pro, or M4 Max.",
      price: 899990,
      stock: 8,
      images: ["https://example.com/macbook-pro-14-m4.jpg"],
      mainImage: "https://example.com/macbook-pro-14-m4.jpg",
      attributes: {
        processor: "M4 Pro",
        ram: 24,
        storage_type: "SSD",
        storage: 512,
        display: 14.2,
        display_resolution: "3024x1964",
        graphics: "20-core GPU",
        battery_life: "Up to 22 hours",
        ports: "Thunderbolt 5, HDMI, SD card, MagSafe",
        touch_bar: false,
        color: "Space Black",
        weight: 1.6
      }
    },
    {
      title: "MacBook Pro 16-inch M4 Max",
      description: "The most powerful MacBook Pro ever. With M4 Max, you can tackle extreme workflows on the go.",
      price: 1499990,
      stock: 5,
      images: ["https://example.com/macbook-pro-16-m4-max.jpg"],
      mainImage: "https://example.com/macbook-pro-16-m4-max.jpg",
      attributes: {
        processor: "M4 Max",
        ram: 64,
        storage_type: "SSD",
        storage: 1024,
        display: 16.2,
        display_resolution: "3456x2234",
        graphics: "40-core GPU",
        battery_life: "Up to 24 hours",
        ports: "Thunderbolt 5, HDMI, SD card, MagSafe",
        touch_bar: false,
        color: "Silver",
        weight: 2.2
      }
    },
    {
      title: "MacBook Air 13-inch M4",
      description: "MacBook Air M4. Impressively big. Impossibly thin. Built for Apple Intelligence.",
      price: 549990,
      stock: 12,
      images: ["https://example.com/macbook-air-13-m4.jpg"],
      mainImage: "https://example.com/macbook-air-13-m4.jpg",
      attributes: {
        processor: "M4",
        ram: 16,
        storage_type: "SSD",
        storage: 256,
        display: 13.6,
        display_resolution: "2560x1664",
        graphics: "10-core GPU",
        battery_life: "Up to 18 hours",
        ports: "Thunderbolt 4, MagSafe",
        touch_bar: false,
        color: "Midnight",
        weight: 1.24
      }
    }
  ],

  // Electronics - Tablets
  tablets: [
    {
      title: "iPad Pro 13-inch M4",
      description: "iPad Pro. With the new M4 chip, it's impossibly thin and incredibly powerful.",
      price: 649990,
      stock: 10,
      images: ["https://example.com/ipad-pro-13-m4.jpg"],
      mainImage: "https://example.com/ipad-pro-13-m4.jpg",
      attributes: {
        display: 13,
        display_resolution: "2752x2064",
        processor: "M4",
        ram: 16,
        storage: 512,
        battery: "10 hours",
        camera_main: "12MP Wide",
        camera_front: "12MP Ultra Wide",
        cellular: true,
        apple_pencil_support: true,
        color: "Space Black",
        weight: 579
      }
    },
    {
      title: "iPad Air 11-inch M3",
      description: "iPad Air. Built for Apple Intelligence. Incredibly powerful. Incredibly versatile.",
      price: 399990,
      stock: 15,
      images: ["https://example.com/ipad-air-11-m3.jpg"],
      mainImage: "https://example.com/ipad-air-11-m3.jpg",
      attributes: {
        display: 11,
        display_resolution: "2360x1640",
        processor: "M3",
        ram: 8,
        storage: 128,
        battery: "10 hours",
        camera_main: "12MP Wide",
        camera_front: "12MP Ultra Wide",
        cellular: false,
        apple_pencil_support: true,
        color: "Blue",
        weight: 462
      }
    },
    {
      title: "iPad 10th Generation",
      description: "iPad. The colorful new iPad is more versatile than ever.",
      price: 249990,
      stock: 25,
      images: ["https://example.com/ipad-10.jpg"],
      mainImage: "https://example.com/ipad-10.jpg",
      attributes: {
        display: 10.9,
        display_resolution: "2360x1640",
        processor: "A14 Bionic",
        ram: 4,
        storage: 64,
        battery: "10 hours",
        camera_main: "12MP Wide",
        camera_front: "12MP Ultra Wide",
        cellular: false,
        apple_pencil_support: false,
        color: "Yellow",
        weight: 487
      }
    }
  ],

  // Electronics - Smart Watches
  smart_watches: [
    {
      title: "Apple Watch Ultra 2",
      description: "The most rugged and capable Apple Watch. Built for exploration, athletics, and adventure.",
      price: 449990,
      stock: 12,
      images: ["https://example.com/watch-ultra-2.jpg"],
      mainImage: "https://example.com/watch-ultra-2.jpg",
      attributes: {
        case_size: 49,
        display: "Retina OLED",
        water_resistance: "100m",
        battery_life: "36 hours",
        gps: true,
        cellular: true,
        heart_rate: true,
        ecg: true,
        color: "Titanium",
        band_material: "Titanium"
      }
    },
    {
      title: "Apple Watch Series 10",
      description: "The biggest screen ever on Apple Watch. Built for Apple Intelligence.",
      price: 299990,
      stock: 20,
      images: ["https://example.com/watch-series-10.jpg"],
      mainImage: "https://example.com/watch-series-10.jpg",
      attributes: {
        case_size: 46,
        display: "Retina OLED",
        water_resistance: "50m",
        battery_life: "18 hours",
        gps: true,
        cellular: true,
        heart_rate: true,
        ecg: true,
        color: "Silver Aluminum",
        band_material: "Sport Band"
      }
    },
    {
      title: "Apple Watch SE",
      description: "Apple Watch SE. Essential features for you and your family at an exceptional value.",
      price: 169990,
      stock: 30,
      images: ["https://example.com/watch-se.jpg"],
      mainImage: "https://example.com/watch-se.jpg",
      attributes: {
        case_size: 44,
        display: "Retina OLED",
        water_resistance: "50m",
        battery_life: "18 hours",
        gps: true,
        cellular: false,
        heart_rate: true,
        ecg: false,
        color: "Midnight",
        band_material: "Sport Band"
      }
    }
  ],

  // Electronics - Headphones
  headphones: [
    {
      title: "AirPods Pro 2nd Generation",
      description: "AirPods Pro. Rebuilt from the sound up. With H2 chip and USB-C charging.",
      price: 129990,
      stock: 50,
      images: ["https://example.com/airpods-pro-2.jpg"],
      mainImage: "https://example.com/airpods-pro-2.jpg",
      attributes: {
        type: "In-ear",
        wireless: true,
        noise_canceling: true,
        transparency_mode: true,
        spatial_audio: true,
        battery_life: "6 hours (30 with case)",
        charging_case: true,
        color: "White",
        weight: 5.3
      }
    },
    {
      title: "AirPods 4",
      description: "AirPods 4. The next evolution of AirPods with enhanced audio and voice quality.",
      price: 89990,
      stock: 40,
      images: ["https://example.com/airpods-4.jpg"],
      mainImage: "https://example.com/airpods-4.jpg",
      attributes: {
        type: "In-ear",
        wireless: true,
        noise_canceling: true,
        transparency_mode: true,
        spatial_audio: true,
        battery_life: "5 hours (30 with case)",
        charging_case: true,
        color: "White",
        weight: 4.3
      }
    },
    {
      title: "AirPods Max",
      description: "AirPods Max. High-fidelity audio with computational audio and Active Noise Cancellation.",
      price: 349990,
      stock: 15,
      images: ["https://example.com/airpods-max.jpg"],
      mainImage: "https://example.com/airpods-max.jpg",
      attributes: {
        type: "Over-ear",
        wireless: true,
        noise_canceling: true,
        transparency_mode: true,
        spatial_audio: true,
        battery_life: "20 hours",
        charging_case: false,
        color: "Space Black",
        weight: 386
      }
    }
  ],

  // Electronics - Desktops
  desktops: [
    {
      title: "Mac Studio M2 Max",
      description: "Mac Studio. A remarkably compact power station. With M2 Max or M2 Ultra.",
      price: 1199990,
      stock: 6,
      images: ["https://example.com/mac-studio.jpg"],
      mainImage: "https://example.com/mac-studio.jpg",
      attributes: {
        processor: "M2 Max",
        ram: 64,
        storage_type: "SSD",
        storage: 1024,
        graphics: "38-core GPU",
        ports: "Thunderbolt 4, USB-A, HDMI, SD card, 10Gb Ethernet",
        bluetooth: "5.3",
        wifi: "Wi-Fi 6E",
        color: "Silver",
        weight: 2.7
      }
    },
    {
      title: "Mac Mini M2",
      description: "Mac Mini. The compact powerhouse built for Apple Intelligence.",
      price: 399990,
      stock: 15,
      images: ["https://example.com/mac-mini-m2.jpg"],
      mainImage: "https://example.com/mac-mini-m2.jpg",
      attributes: {
        processor: "M2",
        ram: 16,
        storage_type: "SSD",
        storage: 256,
        graphics: "10-core GPU",
        ports: "Thunderbolt 4, USB-A, HDMI, 10Gb Ethernet",
        bluetooth: "5.3",
        wifi: "Wi-Fi 6E",
        color: "Silver",
        weight: 1.18
      }
    },
    {
      title: "Mac Pro",
      description: "Mac Pro. The most powerful Mac ever. With M2 Ultra.",
      price: 3999990,
      stock: 3,
      images: ["https://example.com/mac-pro.jpg"],
      mainImage: "https://example.com/mac-pro.jpg",
      attributes: {
        processor: "M2 Ultra",
        ram: 192,
        storage_type: "SSD",
        storage: 2048,
        graphics: "76-core GPU",
        ports: "Thunderbolt 4, USB-A, HDMI, 10Gb Ethernet",
        bluetooth: "5.3",
        wifi: "Wi-Fi 6E",
        color: "Silver",
        weight: 16.86
      }
    }
  ],

  // Electronics - Monitors
  monitors: [
    {
      title: "Studio Display",
      description: "Studio Display. A big, beautiful window into your world.",
      price: 699990,
      stock: 8,
      images: ["https://example.com/studio-display.jpg"],
      mainImage: "https://example.com/studio-display.jpg",
      attributes: {
        display_size: 27,
        resolution: "5K (5120x2880)",
        panel_type: "IPS",
        refresh_rate: 60,
        response_time: 5,
        brightness: 600,
        ports: "Thunderbolt 3, USB-C",
        hdr: true,
        color: "Silver",
        height_adjustable: true
      }
    },
    {
      title: "Pro Display XDR",
      description: "Pro Display XDR. The ultimate display for professionals.",
      price: 4999990,
      stock: 2,
      images: ["https://example.com/pro-display-xdr.jpg"],
      mainImage: "https://example.com/pro-display-xdr.jpg",
      attributes: {
        display_size: 32,
        resolution: "6K (6016x3384)",
        panel_type: "IPS",
        refresh_rate: 60,
        response_time: 1,
        brightness: 1600,
        ports: "Thunderbolt 3, USB-C",
        hdr: true,
        color: "Silver",
        height_adjustable: true
      }
    }
  ],

  // Accessories - Chargers
  chargers: [
    {
      title: "MagSafe Charger",
      description: "MagSafe Charger delivers up to 15W of wireless charging for iPhone.",
      price: 15990,
      stock: 50,
      images: ["https://example.com/magsafe-charger.jpg"],
      mainImage: "https://example.com/magsafe-charger.jpg",
      attributes: {
        power: 15,
        ports: 1,
        fast_charging: true,
        type: "MagSafe",
        cable_included: true,
        compatible_devices: "iPhone, AirPods"
      }
    },
    {
      title: "35W Dual USB-C Port Power Adapter",
      description: "35W Dual USB-C Port Power Adapter. Charge two devices at once.",
      price: 24990,
      stock: 40,
      images: ["https://example.com/35w-charger.jpg"],
      mainImage: "https://example.com/35w-charger.jpg",
      attributes: {
        power: 35,
        ports: 2,
        fast_charging: true,
        type: "USB-C",
        cable_included: false,
        compatible_devices: "iPhone, iPad, Mac"
      }
    },
    {
      title: "96W USB-C Power Adapter",
      description: "96W USB-C Power Adapter. Fast, efficient charging for your Mac.",
      price: 39990,
      stock: 25,
      images: ["https://example.com/96w-charger.jpg"],
      mainImage: "https://example.com/96w-charger.jpg",
      attributes: {
        power: 96,
        ports: 1,
        fast_charging: true,
        type: "USB-C",
        cable_included: false,
        compatible_devices: "MacBook Pro, MacBook Air"
      }
    }
  ],

  // Accessories - Cables
  cables: [
    {
      title: "USB-C to Lightning Cable 1m",
      description: "1m USB-C to Lightning Cable. Fast charging and data transfer.",
      price: 4990,
      stock: 100,
      images: ["https://example.com/cable-usbc-lightning.jpg"],
      mainImage: "https://example.com/cable-usbc-lightning.jpg",
      attributes: {
        length: 1,
        connector_type: "USB-C to Lightning",
        data_transfer: "USB 2.0 (480 Mbps)",
        fast_charging: true,
        braided: false
      }
    },
    {
      title: "MagSafe Cable 2m",
      description: "2m MagSafe Cable for convenient wireless charging.",
      price: 6990,
      stock: 60,
      images: ["https://example.com/magsafe-cable.jpg"],
      mainImage: "https://example.com/magsafe-cable.jpg",
      attributes: {
        length: 2,
        connector_type: "MagSafe",
        data_transfer: "N/A",
        fast_charging: true,
        braided: false
      }
    },
    {
      title: "Thunderbolt 4 Pro Cable 1m",
      description: "1m Thunderbolt 4 Pro Cable. High-speed data transfer and charging.",
      price: 14990,
      stock: 30,
      images: ["https://example.com/tb4-cable.jpg"],
      mainImage: "https://example.com/tb4-cable.jpg",
      attributes: {
        length: 1,
        connector_type: "Thunderbolt 4",
        data_transfer: "40 Gbps",
        fast_charging: true,
        braided: true
      }
    }
  ],

  // Accessories - Cases
  cases: [
    {
      title: "iPhone 16 Pro Clear Case",
      description: "iPhone 16 Pro Clear Case. Ultra-thin, lightweight protection with MagSafe.",
      price: 6990,
      stock: 50,
      images: ["https://example.com/case-iphone16-pro-clear.jpg"],
      mainImage: "https://example.com/case-iphone16-pro-clear.jpg",
      attributes: {
        material: "Polycarbonate",
        color: "Clear",
        wireless_charging: true,
        magsafe: true,
        shock_absorbent: true,
        compatible_model: "iPhone 16 Pro"
      }
    },
    {
      title: "iPhone 16 Pro Max Silicone Case",
      description: "iPhone 16 Pro Max Silicone Case. Soft, smooth silicone exterior.",
      price: 7990,
      stock: 40,
      images: ["https://example.com/case-iphone16-pro-silicone.jpg"],
      mainImage: "https://example.com/case-iphone16-pro-silicone.jpg",
      attributes: {
        material: "Silicone",
        color: "Ultramarine",
        wireless_charging: true,
        magsafe: true,
        shock_absorbent: true,
        compatible_model: "iPhone 16 Pro Max"
      }
    },
    {
      title: "iPad Pro 13-inch Smart Folio",
      description: "iPad Pro 13-inch Smart Folio. Protects your iPad on both sides.",
      price: 14990,
      stock: 30,
      images: ["https://example.com/case-ipad-pro-folio.jpg"],
      mainImage: "https://example.com/case-ipad-pro-folio.jpg",
      attributes: {
        material: "Polyurethane",
        color: "Black",
        wireless_charging: false,
        magsafe: false,
        shock_absorbent: false,
        compatible_model: "iPad Pro 13-inch (M4)"
      }
    }
  ],

  // Accessories - Adapters
  adapters: [
    {
      title: "USB-C Digital AV Multiport Adapter",
      description: "USB-C Digital AV Multiport Adapter. Connect your device to HDMI, USB-A, and USB-C.",
      price: 9990,
      stock: 40,
      images: ["https://example.com/adapter-multiport.jpg"],
      mainImage: "https://example.com/adapter-multiport.jpg",
      attributes: {
        input_type: "USB-C",
        output_type: "HDMI, USB-A, USB-C",
        ports: 3,
        power_delivery: true,
        data_transfer: "5 Gbps"
      }
    },
    {
      title: "USB-C to 3.5mm Headphone Jack Adapter",
      description: "USB-C to 3.5mm Headphone Jack Adapter. Connect headphones to USB-C devices.",
      price: 2990,
      stock: 80,
      images: ["https://example.com/adapter-headphone.jpg"],
      mainImage: "https://example.com/adapter-headphone.jpg",
      attributes: {
        input_type: "USB-C",
        output_type: "3.5mm",
        ports: 1,
        power_delivery: false,
        data_transfer: "N/A"
      }
    },
    {
      title: "USB-C to SD Card Reader",
      description: "USB-C to SD Card Reader. Quickly import photos and videos.",
      price: 6990,
      stock: 35,
      images: ["https://example.com/adapter-sd-reader.jpg"],
      mainImage: "https://example.com/adapter-sd-reader.jpg",
      attributes: {
        input_type: "USB-C",
        output_type: "SD, microSD",
        ports: 2,
        power_delivery: false,
        data_transfer: "104 MB/s"
      }
    }
  ],

  // Accessories - Keyboards
  keyboards: [
    {
      title: "Magic Keyboard",
      description: "Magic Keyboard. Thin, light, and incredibly capable.",
      price: 24990,
      stock: 30,
      images: ["https://example.com/keyboard-magic.jpg"],
      mainImage: "https://example.com/keyboard-magic.jpg",
      attributes: {
        type: "Wireless",
        layout: "QWERTY",
        backlight: true,
        numeric_keypad: false,
        touch_bar: false,
        connection: "Bluetooth, Lightning",
        color: "White",
        compatible_devices: "iMac, Mac, iPad, iPhone"
      }
    },
    {
      title: "Magic Keyboard with Touch ID",
      description: "Magic Keyboard with Touch ID. Fast, easy, and secure authentication.",
      price: 39990,
      stock: 20,
      images: ["https://example.com/keyboard-touchid.jpg"],
      mainImage: "https://example.com/keyboard-touchid.jpg",
      attributes: {
        type: "Wireless",
        layout: "QWERTY",
        backlight: true,
        numeric_keypad: false,
        touch_bar: false,
        connection: "Bluetooth, Lightning",
        color: "White",
        compatible_devices: "Mac with Apple Silicon"
      }
    },
    {
      title: "Magic Keyboard with Numeric Keypad",
      description: "Magic Keyboard with Numeric Keypad. Full-size arrow keys.",
      price: 34990,
      stock: 25,
      images: ["https://example.com/keyboard-numpad.jpg"],
      mainImage: "https://example.com/keyboard-numpad.jpg",
      attributes: {
        type: "Wireless",
        layout: "QWERTY",
        backlight: true,
        numeric_keypad: true,
        touch_bar: false,
        connection: "Bluetooth, Lightning",
        color: "White",
        compatible_devices: "Mac, iPad, iPhone"
      }
    }
  ],

  // Accessories - Mice
  mice: [
    {
      title: "Magic Mouse",
      description: "Magic Mouse. Multi-Touch surface with smooth, consistent performance.",
      price: 9990,
      stock: 40,
      images: ["https://example.com/mouse-magic.jpg"],
      mainImage: "https://example.com/mouse-magic.jpg",
      attributes: {
        type: "Wireless",
        dpi: 1300,
        buttons: 1,
        scroll_wheel: true,
        connection: "Bluetooth, Lightning",
        color: "White",
        compatible_devices: "Mac, iPad"
      }
    },
    {
      title: "Magic Trackpad",
      description: "Magic Trackpad. Large, edge-to-edge glass surface.",
      price: 29990,
      stock: 20,
      images: ["https://example.com/trackpad-magic.jpg"],
      mainImage: "https://example.com/trackpad-magic.jpg",
      attributes: {
        type: "Wireless",
        dpi: 1300,
        buttons: 0,
        scroll_wheel: true,
        connection: "Bluetooth, Lightning",
        color: "White",
        compatible_devices: "Mac, iPad"
      }
    },
    {
      title: "Magic Mouse with Touch ID",
      description: "Magic Mouse with Touch ID. Fast, easy, and secure authentication.",
      price: 14990,
      stock: 15,
      images: ["https://example.com/mouse-touchid.jpg"],
      mainImage: "https://example.com/mouse-touchid.jpg",
      attributes: {
        type: "Wireless",
        dpi: 1300,
        buttons: 1,
        scroll_wheel: true,
        connection: "Bluetooth, Lightning",
        color: "White",
        compatible_devices: "Mac with Apple Silicon"
      }
    }
  ],

  // Accessories - Apple Pencil
  apple_pencil: [
    {
      title: "Apple Pencil Pro",
      description: "Apple Pencil Pro. Squeeze, barrel roll, and haptic feedback.",
      price: 24990,
      stock: 25,
      images: ["https://example.com/pencil-pro.jpg"],
      mainImage: "https://example.com/pencil-pro.jpg",
      attributes: {
        generation: "Pro",
        pressure_sensitivity: true,
        tilt_sensitivity: true,
        magnetic_charging: true,
        compatible_devices: "iPad Pro (M4), iPad Air (M2)"
      }
    },
    {
      title: "Apple Pencil (USB-C)",
      description: "Apple Pencil (USB-C). Affordable precision for iPad.",
      price: 8990,
      stock: 35,
      images: ["https://example.com/pencil-usbc.jpg"],
      mainImage: "https://example.com/pencil-usbc.jpg",
      attributes: {
        generation: "USB-C",
        pressure_sensitivity: true,
        tilt_sensitivity: true,
        magnetic_charging: false,
        compatible_devices: "iPad (10th gen), iPad Air (M2), iPad Pro (M4)"
      }
    },
    {
      title: "Apple Pencil 2nd Generation",
      description: "Apple Pencil 2nd Generation. Wireless charging and double-tap.",
      price: 19990,
      stock: 30,
      images: ["https://example.com/pencil-2.jpg"],
      mainImage: "https://example.com/pencil-2.jpg",
      attributes: {
        generation: "2nd",
        pressure_sensitivity: true,
        tilt_sensitivity: true,
        magnetic_charging: true,
        compatible_devices: "iPad Pro (2018+), iPad Air (2020+)"
      }
    }
  ],

  // Accessories - Hubs & Docks
  hubs_docks: [
    {
      title: "MagSafe Battery Pack",
      description: "MagSafe Battery Pack. Attach and charge on the go.",
      price: 14990,
      stock: 40,
      images: ["https://example.com/magsafe-battery.jpg"],
      mainImage: "https://example.com/magsafe-battery.jpg",
      attributes: {
        ports: "Lightning",
        usb_ports: 0,
        hdmi_ports: 0,
        display_output: "N/A",
        sd_card_reader: false,
        power_delivery: 15,
        ethernet: false,
        audio_jack: false
      }
    },
    {
      title: "Studio Hub",
      description: "Studio Hub. Connect all your devices with one hub.",
      price: 49990,
      stock: 15,
      images: ["https://example.com/studio-hub.jpg"],
      mainImage: "https://example.com/studio-hub.jpg",
      attributes: {
        ports: "Thunderbolt 4, USB-C, USB-A, HDMI, SD, Ethernet",
        usb_ports: 4,
        hdmi_ports: 1,
        display_output: "HDMI 2.0",
        sd_card_reader: true,
        power_delivery: 96,
        ethernet: true,
        audio_jack: true
      }
    },
    {
      title: "USB-C Hub Multiport Adapter",
      description: "USB-C Hub Multiport Adapter. Essential connections for your workflow.",
      price: 19990,
      stock: 25,
      images: ["https://example.com/usb-c-hub.jpg"],
      mainImage: "https://example.com/usb-c-hub.jpg",
      attributes: {
        ports: "USB-C, USB-A, HDMI, SD, microSD",
        usb_ports: 2,
        hdmi_ports: 1,
        display_output: "HDMI 4K@60Hz",
        sd_card_reader: true,
        power_delivery: 60,
        ethernet: false,
        audio_jack: true
      }
    }
  ]
};

async function runSeed() {
  log("\n🚀 Starting Product Seed", "green");
  
  // Login as admin
  log("  Logging in as admin...", "yellow");
  const adminLogin = await apiRequest("POST", "/auth/login", {
    phone: "+77000000001",
    password: "admin1234"
  });

  if (!adminLogin.success) {
    log("  ❌ Admin login failed", "red");
    log("  Make sure the server is running and admin exists", "red");
    return;
  }

  const adminToken = adminLogin.data.data.token;
  log("  ✅ Admin logged in", "green");

  // Get categories
  log("  Getting categories...", "yellow");
  const categories = await apiRequest("GET", "/admin/catalog", null, adminToken);
  
  if (!categories.success) {
    log("  ❌ Failed to get categories", "red");
    return;
  }

  const categoryMap = {};
  categories.data.data.forEach(cat => {
    categoryMap[cat.slug] = cat._id;
  });

  log(`  ✅ Found ${categories.data.data.length} categories`, "green");

  // Create products for each subcategory
  let totalCreated = 0;
  let totalSkipped = 0;

  for (const [subcategorySlug, products] of Object.entries(PRODUCT_TEMPLATES)) {
    logSection(`Creating products for ${subcategorySlug}`);
    
    // Find which category this subcategory belongs to
    let categorySlug = null;
    for (const [cat, subs] of Object.entries({
      electronics: ["smartphones", "laptops", "tablets", "smart_watches", "headphones", "desktops"],
      accessories: ["chargers", "cables", "cases", "adapters", "keyboards", "mice", "apple_pencil", "hubs_docks"],
      desktops_monitors: ["desktops", "monitors"]
    })) {
      if (subs.includes(subcategorySlug)) {
        categorySlug = cat;
        break;
      }
    }

    if (!categorySlug) {
      log(`  ⚠️ Could not find category for ${subcategorySlug}`, "yellow");
      continue;
    }

    for (const productTemplate of products) {
      // Check if product already exists
      const slug = productTemplate.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      
      const checkResult = await apiRequest("GET", `/admin/products?slug=${slug}`, null, adminToken);
      
      if (checkResult.success && checkResult.data.data && checkResult.data.data.length > 0) {
        log(`  ⏭️  Product exists, skipping: ${productTemplate.title}`, "yellow");
        totalSkipped++;
        continue;
      }

      const productData = {
        ...productTemplate,
        categorySlug,
        subcategorySlug
      };

      const result = await apiRequest("POST", "/admin/products", productData, adminToken);
      
      if (result.success && result.data.data) {
        log(`  ✅ Created: ${productTemplate.title} - ${productTemplate.price}₸`, "green");
        totalCreated++;
      } else {
        log(`  ❌ Failed: ${productTemplate.title}`, "red");
        if (result.data && result.data.message) {
          log(`     Error: ${result.data.message}`, "red");
        }
      }
    }
  }

  // Summary
  logSection("SEED COMPLETE - Summary");
  log(`  ✅ Created: ${totalCreated} products`, "green");
  log(`  ⏭️  Skipped: ${totalSkipped} products (already exist)`, "yellow");
  log("\n  🎉 Product seeding completed!", "green");
}

runSeed().catch(error => {
  log(`\n  ❌ Seed failed: ${error.message}`, "red");
  process.exit(1);
});