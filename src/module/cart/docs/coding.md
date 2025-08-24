# コーディング規約

本規約は、Entity / 値オブジェクト（Value Object）/ Event を中心に、クラスベース・イミュータブルな実装スタイルを統一するための指針です。
（本文中のサンプルは TypeScript を想定）

## 基本方針
- 可能な限り**関数型ではなく** `class` や `interface` を用いて OOP で表現する。
- Entity はイミュータブル：副作用を持つメソッドは実装せず、常に新しいインスタンスを返す。
- Entity のプロパティは基本 `private`。必要に応じて `getter` を実装する。
- `getter` を実装する場合は、内部プロパティ名の先頭にアンダースコア（例：_value）を付与する。
- constructor は原則 `private`。生成は static create / of などのファクトリメソッドを使う。
- 値オブジェクトは必須：Entity の各プロパティには必ず値オブジェクトを用いる。
- Event と 値オブジェクトのプロパティは `public readonly` とする（private + getter は原則使わない）。

