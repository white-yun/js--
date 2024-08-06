'use strict'
// 引入scp2var
// eslint-disable-next-line @typescript-eslint/no-var-requires
import client from "scp2"   //用于通过 SCP 协议上传文件。
import { Client } from "ssh2";  //用于通过 SSH 执行远程命令。
// eslint-disable-next-line @typescript-eslint/no-var-requires
const conn = new Client();
const host = "1.95.2.49"
const port = "22"
const username = "root"
const password = "GUIyangTEST@@01"
const path = "/usr/local/dist"
const deleteFile = "rm -rf /usr/local/dist/*"
const shell = "sudo systemctl reload nginx"
// 修改逻辑，需要先删除文件内容，然后再上传文件，再重启nginx
conn.on('ready', () => {
  console.log('Client :: ready');
  console.log("连接成功，开始删除文件");
  // 连接成功
  conn.exec(deleteFile, (err1) => {
    if (!err1) {
      console.log("删除已有文件成功");
      console.log("开始上传文件")
      client.scp('./dist/',
        //默认打包的路径
        {
          'host': host,
          'port': port,
          'username': username,
          'password': password,
          'path': path
        },
        err => {
          if (!err) {
            console.log('项目发布完毕!')
            console.log("开始重启nginx")
            // 连接成功
            conn.exec(shell, (err2) => {
              if (!err2) {
                console.log("重启nginx成功");
              } else {
                console.log("nginx重启失败");
              }
              conn.end()
            })
          } else {
            conn.end()
            console.log("上传文件失败，终止重启nginx")
            console.log('err', err)
          }
        }
      )
    }else{
      console.log("删除文件失败")
      conn.end()
    }
  })
}).connect({
  host: host,
  port: 22,
  username: username,
  password: password
})
