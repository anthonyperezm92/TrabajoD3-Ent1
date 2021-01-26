// I. Configuración
grafT2 = d3.select('#grafT2')
debugger;
anchoT2_totalT2 = graf.style('width').slice(0, -2)
altoT2_totalT2 = anchoT2_totalT2 * 9 / 16

grafT2.style('width', `${ anchoT2_totalT2 }px`)
    .style('height', `${ altoT2_totalT2 }px`)

marginsT2 = { top: 20, left: 50, right: 15, bottom: 120 }

anchoT2 = anchoT2_totalT2 - marginsT2.left - marginsT2.right
altoT2  = altoT2_totalT2 - marginsT2.top - marginsT2.bottom

// II. Variables globales
svgT2 = grafT2.append('svg')
          .style('width', `${ anchoT2_totalT2 }px`)
          .style('height', `${ altoT2_totalT2 }px`)

gT2 = svgT2.append('g')
        .attr('transform', `translate(${ marginsT2.left }, ${ marginsT2.top })`)
        .attr('width', anchoT2 + 'px')
        .attr('height', altoT2 + 'px')

yT2 = d3.scaleLinear()
          .range([altoT2, 0])

xT2 = d3.scaleBand()
      .range([0, anchoT2])
      .paddingInner(0.1)
      .paddingOuter(0.3)

colorT2 = d3.scaleOrdinal()
          // https://bl.ocks.org/pstuffa/3393ff2711a53975040077b7453781a9
          .range(d3.schemeAccent)

xAxisGroupT2 = gT2.append('g')
              .attr('transform', `translate(0, ${ altoT2 })`)
              .attr('class', 'eje')
yAxisGroupT2 = gT2.append('g')
              .attr('class', 'eje')

dataArrayT2 = []

// (1) Variables globales para determinar que mostrar y
//     poder obtener los datos del select
topSelectT2 = d3.select('#seltopT2')

metricaT2 = 'promedio'

var tooltipT2 = d3.select("body").append("div").attr("class", "toolTip");
// III. render (update o dibujo)
function renderT2(dataT2) {
  // function(d, i) { return d }
  // (d, i) => d
  barsT2 = gT2.selectAll('rect')
            .data(dataT2, d => d.edad)

  barsT2.enter()
      .append('rect')
        .style('width', '0px')
        .style('height', '0px')
        .style('y', `${yT2(0)}px`)
        .style('fill', '#000')        
      .merge(barsT2)
        .transition()
        // https://bl.ocks.org/d3noob/1ea51d03775b9650e8dfd03474e202fe
        // .ease(d3.easeElastic)
        .duration(2000)
          .style('x', d => xT2(d.edad) + 'px')
          .style('y', d => (yT2(d[metricaT2])) + 'px')
          .style('height', d => (altoT2 - yT2(d[metricaT2])) + 'px')
          .style('fill', d => colorT2(d.edad))
          .style('width', d => `${xT2.bandwidth()}px`)

          gT2.selectAll('rect')
            .on("mousemove", function(event,d){
              console.log(d);
              tooltipT2
                .style("left", event.pageX - 50 + "px")
                .style("top", event.pageY - 70 + "px")
                .style("display", "inline-block")
                .html((d.Pais) + "<br>" +(d.edad) + "<br>" + "Promedio Suicidios: " + (d.promedio));
          })

  barsT2.exit()
      .transition()
      .duration(2000)
        .style('height', '0px')
        .style('y', d => `${yT2(0)}px`)
        .style('fill', '#000000')
      .remove()


  yAxisCallT2 = d3.axisLeft(yT2)
                .ticks(10)
                .tickFormat(d => d + '')
  yAxisGroupT2.transition()
            .duration(2000)
            .call(yAxisCallT2)

  xAxisCallT2 = d3.axisBottom(xT2)
  xAxisGroupT2.transition()
            .duration(2000)
            .call(xAxisCallT2)
            .selectAll('text')
            .attr('x', '-8px')
            .attr('y', '-5px')
            .attr('text-anchor', 'end')
            .attr('transform', 'rotate(-60)')
}

// IV. Carga de datos
d3.csv('edad.csv')
.then(function(dataT2) {
  dataT2.forEach(d => {
    d.promedio = +d.promedio
  })
debugger;
  dataArrayT2 = dataT2

  colorT2.domain(dataT2.map(d => d.edad))
  var l = dataT2.map(d => d.Pais);
  
  result = l.filter((item,index)=>{
    return l.indexOf(item) === index;
  })

  result.forEach(d => {
    topSelectT2.append('option')
                .attr('value', d)
                .text(d)
  })

  // V. Despliegue
  frameT2()
})
.catch(e => {
  console.log('No se tuvo acceso al archivo ' + e.message)
})

function frameT2() {
  dataframeT2 = dataArrayT2

  var ps =   topSelectT2.node().value
$('#id_pais').text(ps);
$('#id_pais2').text(ps);
dataframeT2 = d3.filter(dataArrayT2, d => d.Pais == ps)


  // Calcular la altura más alta dentro de
  // los datos (columna "oficial")
  maxyT2 = d3.max(dataframeT2, d => d.promedio)
  // Creamos una función para calcular la altura
  // de las barras y que quepan en nuestro canvas
  yT2.domain([0, maxyT2])
  xT2.domain(dataframeT2.map(d => d.edad))

  renderT2(dataframeT2)
}

topSelectT2.on('change', () => {
  frameT2()
})
$( "#ex1-tab-2" ).click(function() {
  tooltip.style("display", "none")
});