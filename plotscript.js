
class PlotScript {
    constructor(source) {
        this.source = source

        this.transforms = [
            this.t_VarDef
        ]
    }

    compile() {
        var lines = this.source.split("\n")
        var setup = ""
        var draw = ""

        lines.forEach(line => {
            this.transformLine(line, setup, draw)
        })
    }

    t_VarDef(line) {
        const reg = /var\s+(\w+)\s+=\S+/i
        const res = reg.exec(line)
        if (res.length > 0) {
            return `var ud_${res[0]} = ${res[1]}\n`
        }
    }
}