export interface BuildingAppearancePreset {
  material: string;
  windowStyle: string;
  appearance: string;
  wallColor: string;
  windowColor?: string;
  accentColor?: string;
}

export const buildingAppearancePresetsByNo: Record<string, BuildingAppearancePreset> = {
  "1": { material: "painted brick + concrete", windowStyle: "arched + rectangular mixed windows", appearance: "heritage academic block", wallColor: "#cdb28c", windowColor: "#445468", accentColor: "#b89e76" },
  "2": { material: "concrete + glass", windowStyle: "regular academic grid windows", appearance: "library block", wallColor: "#b8bfc6", windowColor: "#53657a", accentColor: "#a6afb8" },
  "3": { material: "industrial concrete", windowStyle: "horizontal workshop windows", appearance: "engineering workshop block", wallColor: "#9a948d", windowColor: "#39495b", accentColor: "#8b847c" },
  "4": { material: "painted RCC + glass", windowStyle: "dense ribbon windows", appearance: "high-rise engineering block", wallColor: "#e2ddd5", windowColor: "#5b6e83", accentColor: "#c7c1b8" },
  "5": { material: "industrial concrete", windowStyle: "rectangular workshop windows", appearance: "mechanical block", wallColor: "#8e877f", windowColor: "#3e4d60", accentColor: "#7f766d" },
  "6": { material: "concrete", windowStyle: "standard grid windows", appearance: "new mechanical block", wallColor: "#b2aba1", windowColor: "#4f6072", accentColor: "#9b9288" },
  "7": { material: "weathered concrete", windowStyle: "standard corridor windows", appearance: "electrical block", wallColor: "#a29a90", windowColor: "#445567", accentColor: "#8b8177" },
  "8": { material: "concrete + light glass", windowStyle: "modern grid windows", appearance: "AI/robotics block", wallColor: "#c5c9c3", windowColor: "#5f7286", accentColor: "#aeb4ad" },
  "9": { material: "concrete plaster", windowStyle: "long corridor strip windows", appearance: "chemical engineering block", wallColor: "#b7ad9f", windowColor: "#4c5d70", accentColor: "#9f9588" },
  "10": { material: "painted concrete", windowStyle: "dense vertical window stacks", appearance: "biotech/cybersecurity block", wallColor: "#c8beb1", windowColor: "#56687d", accentColor: "#aba399" },
  "11": { material: "painted concrete", windowStyle: "hostel ribbon windows", appearance: "high-rise hostel", wallColor: "#d9d4cc", windowColor: "#5f7083", accentColor: "#c2bbb0" },
  "12": { material: "plastered concrete", windowStyle: "school-style repeated windows", appearance: "PUC block", wallColor: "#beb39f", windowColor: "#4e6074", accentColor: "#a29a8f" },
  "13": { material: "plastered concrete", windowStyle: "business school window grid", appearance: "business block", wallColor: "#c6ba9f", windowColor: "#53657a", accentColor: "#ada58d" },
  "14": { material: "concrete", windowStyle: "studio + corridor windows", appearance: "architecture block", wallColor: "#aba498", windowColor: "#4c5e72", accentColor: "#988f84" },
  "15": { material: "painted concrete", windowStyle: "regular rectangular windows", appearance: "MBA block", wallColor: "#c5bdb2", windowColor: "#53667a", accentColor: "#b2aba0" },
  "16": { material: "concrete", windowStyle: "small classroom windows", appearance: "school block", wallColor: "#b1aa9d", windowColor: "#4a5d72", accentColor: "#9f978c" },
  "17": { material: "concrete + tinted glass", windowStyle: "engineering grid windows", appearance: "electronics block", wallColor: "#bfb8ae", windowColor: "#415367", accentColor: "#a8a094" },
  "18": { material: "light concrete", windowStyle: "limited modern fenestration", appearance: "innovation block", wallColor: "#cfc8be", windowColor: "#5d6f83", accentColor: "#b9b2a8" },
  "19": { material: "concrete + plaster", windowStyle: "dense classroom windows", appearance: "CSE/ISE/AIML block", wallColor: "#b9b2a7", windowColor: "#52657a", accentColor: "#a49c91" },
  "20": { material: "painted concrete", windowStyle: "hostel ribbon windows", appearance: "girls hostel", wallColor: "#d7d1ca", windowColor: "#607287", accentColor: "#bcb5ad" },
  "21": { material: "aged concrete", windowStyle: "hostel-style window bands", appearance: "old hostel block", wallColor: "#bfb8ad" },
  "22": { material: "brick + plaster", windowStyle: "medium density windows", appearance: "dark chocolate block", wallColor: "#7a5c3e" },
  "23": { material: "painted concrete", windowStyle: "hostel ribbon windows", appearance: "boys hostel high-rise", wallColor: "#ccc6bd" },
  "24": { material: "concrete", windowStyle: "civil/polytechnic grid windows", appearance: "polytechnic/civil block", wallColor: "#aea698" },
  "25": { material: "painted concrete", windowStyle: "admin-style rectangular windows", appearance: "dental/admission block", wallColor: "#c6bfb4" },
  "26": { material: "painted concrete", windowStyle: "limited admin windows", appearance: "hall of admission", wallColor: "#bbb5ab" },
};

