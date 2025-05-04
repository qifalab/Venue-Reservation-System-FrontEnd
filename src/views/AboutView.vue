 <template>
  <div class="about">
    <div class="authors-container">
      <el-card v-for="author in authors" :key="author.name" class="author-card" shadow="always">
        <div class="avatar-container">
          <el-avatar :size="100" :src="author.avatar">
            {{ author.name.charAt(0) }}
          </el-avatar>
        </div>
        <h2 class="author-title">{{ author.role }}</h2>
        <h3 class="author-name">{{ author.name }}</h3>
        <div class="role">在校大学生</div>
        
        <div class="education">
          <el-tag type="info" effect="plain">{{ author.university }}</el-tag>
          <div class="major">{{ author.major }}</div>
        </div>

        <div class="bio">{{ author.bio }}</div>

        <div class="skills">
          <el-tag v-for="skill in author.skills" 
                  :key="skill" 
                  class="skill-tag"
                  :type="getRandomType()">
            {{ skill }}
          </el-tag>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const authors = ref([
  {
    name: "Calvin",
    role: "项目负责人",
    university: "CDTU",
    major: "物联网工程",
    avatar: "https://avatars.githubusercontent.com/u/default",
    skills: ['Vue.js', 'Java', 'Spring Boot', 'MySQL', 'Element Plus'],
    bio: "热爱编程，专注于全栈开发。擅长前后端技术的整合，追求代码的优雅与效率。联系我们：yuyue@qifalab.com"
  },
  {
    name: "sml",
    role: "前端开发",
    university: "CDTU",
    major: "物联网工程",
    avatar: "https://avatars.githubusercontent.com/u/default",
    skills: ['Vue.js', 'TypeScript', 'Element Plus', 'CSS3'],
    bio: "专注于前端开发，热衷于创造优秀的用户界面和交互体验。对新技术充满热情。"
  },
  {
    name: "lch",
    role: "后端开发",
    university: "CDTU",
    major: "物联网工程",
    avatar: "https://avatars.githubusercontent.com/u/default",
    skills: ['Java', 'Spring Boot', 'MySQL'],
    bio: "专注后端开发，热爱解决复杂问题。擅长数据库设计和系统架构，追求代码的可靠性。"
  }
]);

const getRandomType = () => {
  const types = ['', 'success', 'warning', 'info'];
  return types[Math.floor(Math.random() * types.length)];
}
</script>

<style scoped>
.about {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  height: 100vh;
  background: linear-gradient(135deg, #f6f8fb, #e9ecef);
  padding: 0 20px;
  box-sizing: border-box;
}

.authors-container {
  display: flex;
  gap: 25px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.author-card {
  width: 300px;
  padding: 30px;
  border-radius: 20px;
  background: #fff;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
}

.author-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
}

.avatar-container {
  margin-bottom: 20px;
}

.author-title {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

.author-name {
  font-size: 20px;
  font-weight: 500;
  color: #3498db;
  margin-bottom: 8px;
}

.role {
  color: #666;
  font-size: 16px;
  margin-bottom: 15px;
}

.education {
  margin: 20px 0;
}

.major {
  color: #666;
  font-size: 14px;
  margin-top: 8px;
}

.bio {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin: 20px 0;
  padding: 0 10px;
  text-align: justify;
}

.skills {
  margin: 15px 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.skill-tag {
  font-size: 12px;
}

@media (max-width: 768px) {
  .about {
    height: auto;
    min-height: 100vh;
    padding: 40px 20px;
  }
  
  .authors-container {
    gap: 20px;
  }
  
  .author-card {
    width: 100%;
    max-width: 300px;
  }
}
</style>
