// I. Configuración
graf = d3.select('#graf')
ancho_total = graf.style('width').slice(0, -2)
alto_total = ancho_total * 9 / 16

graf.style('width', `${ ancho_total }px`)
    .style('height', `${ alto_total }px`)

margins = { top: 20, left: 50, right: 15, bottom: 120 }

ancho = ancho_total - margins.left - margins.right
alto  = alto_total - margins.top - margins.bottom

// II. Variables globales
svg = graf.append('svg')
          .style('width', `${ ancho_total }px`)
          .style('height', `${ alto_total }px`)

g = svg.append('g')
        .attr('transform', `translate(${ margins.left }, ${ margins.top })`)
        .attr('width', ancho + 'px')
        .attr('height', alto + 'px')

y = d3.scaleLinear()
          .range([alto, 0])

x = d3.scaleBand()
      .range([0, ancho])
      .paddingInner(0.1)
      .paddingOuter(0.3)

color = d3.scaleOrdinal()
          // https://bl.ocks.org/pstuffa/3393ff2711a53975040077b7453781a9
          .range(d3.schemeAccent)

xAxisGroup = g.append('g')
              .attr('transform', `translate(0, ${ alto })`)
              .attr('class', 'eje')
yAxisGroup = g.append('g')
              .attr('class', 'eje')

dataArray = []

// (1) Variables globales para determinar que mostrar y
//     poder obtener los datos del select
topSelect = d3.select('#seltop')

metrica = 'promedio'
ascendente = false

var tooltip = d3.select("body").append("div").attr("class", "toolTip");
// III. render (update o dibujo)
function render(data) {
  // function(d, i) { return d }
  // (d, i) => d
  bars = g.selectAll('rect')
            .data(data, d => d.Pais)

  bars.enter()
      .append('rect')
        .style('width', '0px')
        .style('height', '0px')
        .style('y', `${y(0)}px`)
        .style('fill', '#000')        
      .merge(bars)
        .transition()
        // https://bl.ocks.org/d3noob/1ea51d03775b9650e8dfd03474e202fe
        // .ease(d3.easeElastic)
        .duration(2000)
          .style('x', d => x(d.Pais) + 'px')
          .style('y', d => (y(d[metrica])) + 'px')
          .style('height', d => (alto - y(d[metrica])) + 'px')
          .style('fill', d => color(d.Pais))
          .style('width', d => `${x.bandwidth()}px`)

          g.selectAll('rect')
            .on("mousemove", function(event,d){
              tooltip
                .style("left", event.pageX - 50 + "px")
                .style("top", event.pageY - 70 + "px")
                .style("display", "inline-block")
                .html((d.Pais) + "<br>" + "Promedio Suicidios: " + (d.promedio));
          })

  bars.exit()
      .transition()
      .duration(2000)
        .style('height', '0px')
        .style('y', d => `${y(0)}px`)
        .style('fill', '#000000')
      .remove()


  yAxisCall = d3.axisLeft(y)
                .ticks(10)
                .tickFormat(d => d + '')
  yAxisGroup.transition()
            .duration(2000)
            .call(yAxisCall)

  xAxisCall = d3.axisBottom(x)
  xAxisGroup.transition()
            .duration(2000)
            .call(xAxisCall)
            .selectAll('text')
            .attr('x', '-8px')
            .attr('y', '-5px')
            .attr('text-anchor', 'end')
            .attr('transform', 'rotate(-60)')
}

// IV. Carga de datos
d3.csv('promedio_suma.csv')
.then(function(data) {
  data.forEach(d => {
    d.promedio = +d.promedio
  })
debugger;
  dataArray = data

  color.domain(data.map(d => d.Pais))

  var opt = [{valor: '5' , texto : 'TOP 5'},{valor: '10' , texto : 'TOP 10'},{valor: '20' , texto : 'TOP 20'}]

 opt.forEach(d => {
    console.log(d)
    topSelect.append('option')
                .attr('value', d.valor)
                .text(d.texto)
  })

  // V. Despliegue
  frame()
})
.catch(e => {
  console.log('No se tuvo acceso al archivo ' + e.message)
})

function frame() {
  dataframe = dataArray
  dataframe.sort((a, b) => {
    debugger;
    return  d3.descending(a.promedio, b.promedio)
  })

  var num =   0 + topSelect.node().value

  dataframe = dataArray.slice(0, num)


  // Calcular la altura más alta dentro de
  // los datos (columna "oficial")
  maxy = d3.max(dataframe, d => d.promedio)
  // Creamos una función para calcular la altura
  // de las barras y que quepan en nuestro canvas
  y.domain([0, maxy])
  x.domain(dataframe.map(d => d.Pais))

  render(dataframe)
}

topSelect.on('change', () => {
  frame()
})
$( "#ex1-tab-1" ).click(function() {
  tooltipT2.style("display", "none")
});