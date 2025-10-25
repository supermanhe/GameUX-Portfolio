# Case JSON → `projects.ts` 更新规范

> 适用于当收到新的 Case 导出 JSON 后，需要同步更新 `data/projects.ts` 中案例数据的场景。

## 1. 快速检查输入
1. 确认 JSON 根字段包含 `project`、`caseId`、`title`、`highlights`、`article` 和 `exportedAt`。
2. `article` 下通常会同时提供 `markdown`、`html` 与结构化的 `json`。后续步骤以 `markdown` 与 `html` 为主要来源。

## 2. 定位目标 Case
1. 打开 `data/projects.ts`。
2. 在对应的 `project.slug` 下找到 `cases` 数组中 `id === caseId` 的对象。
3. 若不存在，先复制一个 Case 模板插入；若存在，则准备覆盖其字段。

## 3. 同步基础字段
- 将 JSON 中的 `title`、`highlights` 覆盖到 Case 的 `title` 与 `highlights`。
- 如需新增或删除高亮要点，保持数组顺序与 JSON 一致。

## 4. 维护 `media` 列表
1. 遍历 `article.html` 中出现的 `<img>`、`<video>` 或其他媒体标签。
2. 在 `media` 数组中为每个媒体条目创建对象：
   - `type` 取值 `image` / `gif` / `video` / `embed`，根据资源类型判断。
   - `src` 来自标签的 `src` 属性。
   - 如导出里提供 `poster`、`alt`、`title` 等信息，可根据需要补充。
3. 维持媒体顺序与 HTML 中出现的顺序一致，保证封面和编辑器预览正确。

## 5. 构建 `articleMDX`
1. 使用模板字符串 `md\`...\`` 包裹正文，内容源自导出 JSON 的 `markdown` 与必要的 HTML 片段。
2. 保留 Markdown 标题与列表原样，确保渲染风格与导出一致。
3. 若 `html` 中包含 Markdown 无法直接表达的结构（如带 class 的 `<video>` 包裹、定制 `<img>` 属性等），在 `articleMDX` 对应位置插入相同的 HTML 片段。
4. 注意：
   - 模板字符串内需要通过缩进保持结构清晰，但不要额外引入不必要的空格。
   - 反引号 `` ` `` 在正文出现时要转义为 ``\` ``。

## 6. 校验与提交前检查
1. 运行 `npm run lint` 确保类型与格式无误。
2. 确认 `media`、`highlights`、`articleMDX` 的顺序与导出 JSON 一致。
3. 如有多处 Case 同步，逐个重复上述流程。

## 7. 提交说明建议
- Summary：概述同步了哪些 Case 的导出内容。
- Testing：列出运行的检查命令（例如 `npm run lint`）。

> 小贴士：保留此文件，后续每次收到新的导出 JSON 只需按照步骤检查并更新，可避免漏项或顺序错误。
