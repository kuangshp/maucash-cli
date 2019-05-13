#!/usr/bin/env node

const program = require('commander');
const Printer = require('@darkobits/lolcatjs');
const shelljs = require('shelljs');
const chalk = require('chalk');
const inquirer = require('inquirer');
const home = require('home');
const path = require('path');
const ora = require('ora');
const download = require('download-git-repo');

// https://www.bootschool.net/ascii
const maucashInput = [
  "                                                                                                                    hhhhhhh            ",
  "                                                                                                                    h:::::h            ",
  "                                                                                                                    h:::::h            ",
  "                                                                                                                    h:::::h            ",
  "   mmmmmmm    mmmmmmm     aaaaaaaaaaaaa   uuuuuu    uuuuuu      cccccccccccccccc  aaaaaaaaaaaaa       ssssssssss    h::::h hhhhh       ",
  " mm:::::::m  m:::::::mm   a::::::::::::a  u::::u    u::::u    cc:::::::::::::::c  a::::::::::::a    ss::::::::::s   h::::hh:::::hhh    ",
  "m::::::::::mm::::::::::m  aaaaaaaaa:::::a u::::u    u::::u   c:::::::::::::::::c  aaaaaaaaa:::::a ss:::::::::::::s  h::::::::::::::hh  ",
  "m::::::::::::::::::::::m           a::::a u::::u    u::::u  c:::::::cccccc:::::c           a::::a s::::::ssss:::::s h:::::::hhh::::::h ",
  "m:::::mmm::::::mmm:::::m    aaaaaaa:::::a u::::u    u::::u  c::::::c     ccccccc    aaaaaaa:::::a  s:::::s  ssssss  h::::::h   h::::::h",
  "m::::m   m::::m   m::::m  aa::::::::::::a u::::u    u::::u  c:::::c               aa::::::::::::a    s::::::s       h:::::h     h:::::h",
  "m::::m   m::::m   m::::m a::::aaaa::::::a u::::u    u::::u  c:::::c              a::::aaaa::::::a       s::::::s    h:::::h     h:::::h",
  "m::::m   m::::m   m::::ma::::a    a:::::a u:::::uuuu:::::u  c::::::c     ccccccca::::a    a:::::a ssssss   s:::::s  h:::::h     h:::::h",
  "m::::m   m::::m   m::::ma::::a    a:::::a u:::::::::::::::uuc:::::::cccccc:::::ca::::a    a:::::a s:::::ssss::::::s h:::::h     h:::::h",
  "m::::m   m::::m   m::::ma:::::aaaa::::::a  u:::::::::::::::u c:::::::::::::::::ca:::::aaaa::::::a s::::::::::::::s  h:::::h     h:::::h",
  "m::::m   m::::m   m::::m a::::::::::aa:::a  uu::::::::uu:::u  cc:::::::::::::::c a::::::::::aa:::a s:::::::::::ss   h:::::h     h:::::h",
  "mmmmmm   mmmmmm   mmmmmm  aaaaaaaaaa  aaaa    uuuuuuuu  uuuu    cccccccccccccccc  aaaaaaaaaa  aaaa  sssssssssss     hhhhhhh     hhhhhhh",
  "maucash脚手架(1.0)"
].join('\n');
program.version(Printer.default.fromString(maucashInput), '-v, --version');
// 定义全部的方法
const binHander = {
  init() {
    inquirer
      .prompt([
        {
          type: "text",
          message: "请输入文件夹名称",
          name: "dirname"
        },
        {
          type: "list",
          message: "请选择前端框架",
          choices: ["Vue", "React", "Angular"],
          name: "frameType"
        }
      ])
      .then(answers => {
        // 获取用户输入的文件夹名
        const { dirname, frameType, langue } = answers;
        if (!dirname) {
          console.error(`${chalk.red('✘')} ${chalk.red('没有输入文件名,无法创建项目')}`);
          process.exit(1);
        }
        // 创建一个文件夹
        const _dirname = path.join(home.resolve(), dirname);
        shelljs.mkdir(_dirname);
        switch (frameType) {
          case 'Vue':
            const template = 'direct:git@github.com:kuangshp/admin-web.git';
            const spinner = ora('👨‍🍳开始下载模板中....');
            spinner.start();
            shelljs.cd(_dirname);
            download(template, _dirname, { clone: true }, err => {
              spinner.stop();
              if (err) {
                console.log(`${chalk.red(下载失败)}【${chalk.yellow(err.message.trim())}】`);
              } else {
                console.log(`${chalk.green('✔')} ${chalk.yellow('成功创建项目')} ${chalk.green(dirname)}`);
                // 修改下载来的项目package.json文件
                shelljs.sed('-i', 'admin-web', dirname, 'package.json')
              }
            })
            break;
          case 'React':
            inquirer
              .prompt([
                {
                  type: "list",
                  message: "请选择开发语言",
                  choices: ["JavaScript", "TypeScript"],
                  name: "langue"
                }
              ])
              .then(result => {
                console.log(`${chalk.yellow('☄')} ${chalk.red('抱歉React的脚手架还在开发过程中....')}`);
                // console.log(`${chalk.green('✔')} ${chalk.yellow('成功创建项目')} ${chalk.green(dirname)}`)
              })
            break;
          case 'Angular':
            console.log(`${chalk.yellow('☄')} ${chalk.red('抱歉Angular的脚手架还在开发过程中....')}`);
            break;
          default:
            break;
        }
      });
  }
}
program
  .usage("[cmd] <options>")
  .arguments("<cmd> [env]")
  .action((cmd, otherParms) => {
    const hander = binHander[cmd];
    if (typeof hander === 'undefained') {
      console.log(`${chalk.yellow("非常遗憾")}【${chalk.red(cmd)}】${chalk.yellow(还没开发)}`);
      process.exit(1);
    } else {
      hander(otherParms);
    }
  })
program.parse(process.argv);

