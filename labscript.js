
//get promise
var dataP = d3.json("class.json");
dataP.then(function(data)
{
  drawChart(data);


},
function(err)
{
  console.log(err);
});//make the screen
var drawChart = function(data)
{

// get correlation matrix

  //calculator
  var getCorr = function(x,y)
  {
    var xHw = [];
    var yHw = [];
    var getHWgrades = x.forEach(function(d,i){
      xHw.push(d.grade);
      yHw.push(y[i].grade);
    })
    console.log(x,y);
  //get mean for x
    var sumX = x.reduce(function(sum,d)
    {//get sum of all of X's hw grades
      return sum+d.grade;
    }, 0)
    console.log('sum',sumX);
    var mx = sumX/x.length;
  //get mean for y
    var sumY = y.reduce(function(sum,d)
    {//get sum of all of X's hw grades
      return sum+d.grade;
    }, 0)
    var my = sumY/y.length;
    console.log('my',my)
    var constant = (1/x.length-1);
    //console.log('constant',constant);
    var sigma = x.reduce(function(sum,d,i)
    {
      var top = (d.grade-mx)*(y[i].grade-my);
    //  console.log("top",top);
      return sum+top;
    },0)

    var bottom = d3.deviation(xHw)*(d3.deviation(yHw));
    console.log('bottom',bottom);
    var topBottom = sigma/bottom;
    console.log('sigma',sigma);
    var corr = constant*topBottom;
    console.log('corr',corr);
    return corr;
  }
  var matrix = [];///keeps all our data for the diagram
  data.forEach(function(s,i)
  {
    var row = [];
    data.forEach(function(eS,j){
      var c = getCorr(s.homework,eS.homework);
      console.log(c);
      row.push(c);
    })
    matrix.push(row);
  })
  console.log(matrix)
//make grid
var screen =
{
  width: 1200,
  height: 1200
}

var margins =
{
  top:10,
  bottom:100,
  left:100,
  right:200
}
var width = screen.width-margins.left-margins.right;
var height = screen.height-margins.top-margins.bottom;
var sq_width = width/data.length;
var sq_height = height/data.length;
var xScale=d3.scaleLinear()
            .domain([0,23])
            //.rangeBands([0,width]);
            .range([0, width]);
//setup scales
var yScale=d3.scaleLinear()
            .domain([0,23])
            .range([height,0]);
var svg = d3.select('svg')
          .attr('width',screen.width)
          .attr('height',screen.height);



var plotLand = svg.append('g')
                .classed("plot",true)
                .attr('width',width)
                .attr('height',height)
                .attr("transform","translate("+margins.left+","+margins.top+")");

var y_s = []
var row = plotLand.selectAll('.row')
        .data(matrix)
        .enter()
        .append('g')
        .attr('class',"row")

var getCols = function(matrix)
              {
                var cols=[]
              matrix.forEach(function(d,i)
              {
                d.forEach(function(dd,j)
              {
                var pos = {
                  x :i,
                  y : j
                }
                cols.push(pos)
              })
            })
            return cols
              }
columns = getCols(matrix);
var column = row.selectAll('rect')
          .data(columns)
          .enter()
          .append('rect')
          .attr("x", function(d)
          {
            return xScale(d.x);
          })
          .attr('y',function(d)
          {
            return yScale(d.y+1);
          })
          .attr("width", sq_width)
          .attr("height", sq_height )
          .attr('fill',function(d)
          {
          if(matrix[d.x][d.y]< -1||matrix[d.x][d.y]>1)
          {
          return 'grey'
          }
          else if(matrix[d.x][d.y]> -1&&matrix[d.x][d.y]< .6)
          {
          return 'green'
          }
          else if(matrix[d.x][d.y]> .6 &&matrix[d.x][d.y]< 1)
          {
          return 'blue'
          }

          })

 var xA = margins.top+height+20;
 var xAxis = d3.axisBottom(xScale)
 xAxis.ticks([23]);

 svg.append('g').classed('xAxis',true)
     .call(xAxis)
     .attr('transform','translate('+ margins.left + ','+xA+')' );
 var yAxis = d3.axisLeft(yScale)
 yAxis.ticks([23]);
 var yA = margins.left-10;
 svg.append('g').classed('yAxis',true)
     .call(yAxis)
     .attr('transform','translate('+yA+ ','+'10'+')' );
//make axis labels
// var yLabel =svg.append('text')
//             .attr('transform','rotate(-90)')
//             .attr('y',0+margins.left-50)
//             .attr('x',0-(height/2))
//             .text('Average Grade');
// var xLabel =svg.append("text")
//             .attr('transform','translate('+(width+margins.left)/2 + ','+(xA+30)+')' )
//             .text('Day');
svg.select('div.students')
    .attr('y',height+30)
}
