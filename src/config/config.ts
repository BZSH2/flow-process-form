/**
 * @description 导出vue/cli配置，以下所有配置修改需要重启项目
 */
export default {
  /**
   * 开发以及部署时的URL
   * hash模式时在不确定二级目录名称的情况下建议使用""代表相对路径或者"/二级目录/"
   * history模式默认使用"/"或者"/二级目录/"，记住只有hash时publicPath可以为空！！！
   */
  publicPath: '',
  /** 生产环境构建文件的目录名 */
  outputDir: 'dist',
  /** 开发环境端口号 */
  devPort: 3000,
}
