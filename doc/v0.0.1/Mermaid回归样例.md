# Mermaid 回归样例

用于验证 v0.0.1 的编辑预览、主题切换及 HTML、PDF、打印输出。预期前 12 个代码块正常显示，最后一个代码块显示错误占位且不阻断其他图表；修正错误代码后应恢复显示。

## 流程图与中文标签

```mermaid
graph TD
  A["中文 & <b>标签</b>"] --> B[完成]
```

## 时序图

```mermaid
sequenceDiagram
  Alice->>Bob: 你好
```

## 类图

```mermaid
classDiagram
  Animal <|-- Duck
```

## 状态图

```mermaid
stateDiagram-v2
  [*] --> Start
```

## 实体关系图

```mermaid
erDiagram
  CUSTOMER ||--o{ ORDER : places
```

## 甘特图

```mermaid
gantt
  title 测试
  dateFormat YYYY-MM-DD
  section 开发
  编码 :a1, 2026-11-02, 1d
```

## 饼图

```mermaid
pie title 占比
  "A" : 30
  "B" : 70
```

## 思维导图

```mermaid
mindmap
  root((Zhuandown))
    Mermaid
```

## 时间线

```mermaid
timeline
  title 时间线
  2026 : 开发
```

## XY 图

```mermaid
xychart-beta
  x-axis [A, B]
  y-axis "数量" 0 --> 10
  bar [3, 7]
```

## 块图

```mermaid
block-beta
  columns 2
  A B
```

## 架构图

```mermaid
architecture-beta
  service api(server)[API]
  service db(database)[Database]
  api:R -- L:db
```

## 错误恢复

下方代码故意无效。将内容替换为 `graph TD; A-->B` 后应恢复显示。

```mermaid
invalid
```
