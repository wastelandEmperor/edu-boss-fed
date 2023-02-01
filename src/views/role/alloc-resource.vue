<template>
  <div>
    <el-card class="box-card" v-for="category in roleResourcesData" :Key="category.id">
      <div slot="header" class="clearfix">
        <el-checkbox :indeterminate="category.isIndeterminate" v-model="category.selected"
                     @change="handleCheckAllChange(category)">
          {{ category.name }}
        </el-checkbox>
      </div>
      <el-checkbox-group v-model="category.checkedResourceIds"
                         @change="handleCheckedResourceChange(category)">
        <el-row :gutter="24">
          <el-col :span="8" v-for="resource in category.resourceList" :key="resource.id">
            <!-- label 决定复选框是否选中 -->
            <el-checkbox :label="resource.id" style="padding: 7px 0">
              {{ resource.name }}
            </el-checkbox>
          </el-col>
        </el-row>
      </el-checkbox-group>
    </el-card>
    <div class="el-btn">
      <el-button @click="onClear">清空</el-button>
      <el-button type="primary" @click="onSave">保存</el-button>
    </div>
  </div>
</template>

<script>
import { getRoleResources, setRoleResources } from '@/api/role'

const cityOptions = ['上海', '北京', '广州', '深圳']
export default {
  name: 'RoleAllocResource',
  data () {
    return {
      roleResourcesData: [],
      checkAll: false,
      checkedCities: ['上海', '北京'],
      cities: cityOptions,
      isIndeterminate: false
    }
  },
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  methods: {
    // 加载角色拥有的资源列表,并筛选和添加有用的数据
    loadRoleResources () {
      getRoleResources(this.roleId).then(res => {
        if (res.data.code === '000000') {
          // 优化原因，筛选出有用的数据
          this.roleResourcesData = res.data.data.map(category => {
            let {
              id,
              name,
              selected,
              resourceList,
              sort
            } = category
            const checkedResourceIds = [] // 记录选中的资源ID
            const allResourceIds = [] // 减号
            let isIndeterminate = false
            if (resourceList) {
              resourceList = resourceList.map(resource => {
                const {
                  id,
                  name,
                  selected,
                  url,
                  description
                } = resource
                allResourceIds.push(id)
                selected && checkedResourceIds.push(id)
                // 当前类别不是全选的话，就显示减号
                isIndeterminate = checkedResourceIds.length > 0 && checkedResourceIds.length < allResourceIds.length
                return {
                  id,
                  name,
                  selected,
                  url,
                  description
                }
              })
            }
            // 资源全选中，类别才选中。但后台计算的是，有一个资源选中，类别就选中。因此需要重新计算一下类别是否选中
            selected = checkedResourceIds.length === allResourceIds.length
            return {
              id,
              name,
              selected,
              resourceList,
              sort,
              checkedResourceIds,
              allResourceIds,
              isIndeterminate
            }
          }).sort((c1, c2) => c1.id - c2.id)
        } else {
          this.$message.error('获取角色列表失败！')
        }
      })
    },
    // 全选
    handleCheckAllChange (category) {
      // V-model
      category.checkedResourceIds = category.selected ? category.allResourceIds : []
      // 不显示减号
      category.isIndeterminate = false
    },
    // 添加资源
    handleCheckedResourceChange (category) {
      // 菜单项目有选中，那么看看当前类别是否已经全选了
      const checkedCount = category.checkedResourceIds.length
      const totalCount = category.allResourceIds.length
      category.selected = checkedCount === totalCount
      category.isIndeterminate = checkedCount > 0 && checkedCount < totalCount
    },
    // 清空
    onClear () {
      this.roleResourcesData.forEach((category) => {
        category.checkedResourceIds = []
        category.selected = false
      })
    },
    // 保存，选中的资源ID
    onSave () {
      const {
        roleId,
        roleResourcesData
      } = this
      // 收集选中的资源ID
      const resourceIdList = roleResourcesData.reduce((res, category) => {
        return res.concat(category.checkedResourceIds)
      }, [])
      setRoleResources({
        roleId,
        resourceIdList
      }).then(res => {
        if (res.data.code === '000000') {
          this.$message.success('给角色分配资源成功!')
          this.$router.push({ name: 'roles' })
        } else {
          this.$message.error('给角色分配资源失败！')
        }
      })
    }
  },
  created () {
    this.loadRoleResources()
  }
}
</script>
<style scoped lang="scss">
.el-card {
  margin-bottom: 15px;
}

.el-btn {
  display: flex;
  justify-content: center;
}

</style>
