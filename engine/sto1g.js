//Issues: 

var sto1G = [ "foobar",
	      [ 0,0.4166 ], //h
	      [0, 0.7739 ]  //he
];

function erf(x) { //http://picomath.org/javascript/erf.js.html
    // constants
    var a1 =  0.254829592;
    var a2 = -0.284496736;
    var a3 =  1.421413741;
    var a4 = -1.453152027;
    var a5 =  1.061405429;
    var p  =  0.3275911;

    // Save the sign of x
    var sign = 1;
    if (x < 0) {
        sign = -1;
    }
    x = Math.abs(x);

    // A&S formula 7.1.26
    var t = 1.0/(1.0 + p*x);
    var y = 1.0 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*Math.exp(-x*x);

    return sign*y;
}

function g1sUnnorm(alpha, rA) {
    return Math.exp(-alpha*( rA[0]*rA[0]+rA[1]*rA[1]+rA[2]*rA[2]));
}

function g1sNormConst(alpha) {
    return Math.pow((2*alpha/Math.PI),0.75);
}

function rP(alpha,rA,beta,rB) {
    return [ (alpha*rA[0]+beta*rB[0])/(alpha+beta) , (alpha*rA[1]+beta*rB[1])/(alpha+beta), (alpha*rA[2]+beta*rB[2])/(alpha+beta) ]; 
}

function diffDot(rA,rB) {
   var diff = [ rA[0]-rB[0] , rA[1]-rB[1], rA[2]-rB[2] ];
   return diff[0]*diff[0]+diff[1]*diff[1]+diff[2]*diff[2];
}
 
function propK(alpha,rA,beta,rB) {  
    return Math.exp(-alpha*beta*( diffDot(rA,rB) )/(alpha + beta));
}

function p(alpha,beta) {
    return alpha+beta;
}

function f0func(t) {
    return erf(Math.sqrt(t + 1e-10))*( Math.sqrt((Math.PI/(t + 1e-10))))/2;
}

function overlapInt(alpha,rA,beta,rB) {
    return g1sNormConst(alpha)*g1sNormConst(beta)*Math.pow((Math.PI/(alpha + beta)),1.5)*propK(alpha, rA, beta, rB);
}

function kineticEnInt(alpha, rA, beta, rB) { 
    return g1sNormConst(alpha)*g1sNormConst(beta)*propK(alpha, rA, beta,rB)*(  ((alpha*beta)/(alpha + beta))*(3 - (2*alpha*beta*(diffDot(rA,rB))/(alpha + beta))))*Math.pow((Math.PI/(alpha +  beta)),1.5);
}

function nuclearInt(alpha, rA, beta, rB, Zc, rC) {
    return g1sNormConst(alpha)*g1sNormConst(beta)*(-2.0*Zc*Math.PI/(alpha + beta))*
	propK(alpha, rA, beta, rB)*
	f0func((alpha +	beta)*(diffDot(rP(alpha, rA, beta, rB) , rC)));
}


function twoelec(alpha, rA, beta, rB, gamma, rC, delta, rD) { //can precalculate constant 2pi, etc.? Check source 
    return g1sNormConst(alpha)*g1sNormConst(beta)*g1sNormConst(gamma)*g1sNormConst(delta)
	*(34.98683666/((alpha + beta)*(gamma + delta)* Math.sqrt(alpha + beta + gamma + delta)))
*propK(alpha, rA, beta, rB)*propK(gamma, rC, delta, rD)
*f0func((alpha + beta)*(gamma + delta)*(diffDot(rP(alpha,rA,beta,rB),rP(gamma,rC,delta,rD)))/(alpha + beta + gamma + delta));
}


