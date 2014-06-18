"use strict";

//Note:  The Eigenvalues returned by numeric.js have the order eig.x[AO-index][MO-index]


function buildPmatr(coeffMatr,nBasis,nOcc) { 
    var Pmatr = numeric.rep([nBasis,nBasis],0);
    for (var t=0;t<nBasis;t++) {
	for (var u=0;u<nBasis;u++) {
	    var tmp=0;
	    for (var j=0;j<nOcc;j++) {
		tmp+=coeffMatr[u][j]*coeffMatr[t][j];
	    }
	    Pmatr[t][u] = 2*tmp;
	}
    }
    return Pmatr;
}

function buildFmatr(thisPmatr,Hmatr,Jmatr,nBasis,nOcc) {
    var Fmatr = numeric.rep([nBasis,nBasis],0);
    for (var r = 0; r<nBasis;r++) {
	for (var s = 0; s<nBasis;s++) {
	    var tmp=Hmatr[r][s];
	    for (var t = 0; t<nBasis;t++) {
		for (var u=0; u<nBasis; u++) {
		    tmp+=thisPmatr[t][u]*(Jmatr[r][s][t][u]-0.5*Jmatr[r][u][t][s]);
		}
	    }
	    Fmatr[r][s]=tmp;
	}
    }
    return Fmatr;
}

function calcVnn(nAtoms,atomZ,atomPos) {
    var Vnn = 0;
    var dist;
    for (var cp = 1; cp<nAtoms; cp++) {
        for (var c = 0; c < cp; c++) {
            dist= [atomPos[c][0]-atomPos[cp][0], atomPos[c][1]-atomPos[cp][1], atomPos[c][2]-atomPos[cp][2]];
            Vnn+=atomZ[c]*atomZ[cp]/Math.sqrt(dist[0]*dist[0] + dist[1]*dist[1]+dist[2]*dist[2]) ;
        }
    }
    return Vnn;
}


function calcHFenergy(sortedEvals,thisPmatr,Vnn,Hmatr,nBasis,nOcc) {
    var energy = 0;
    for (var r=0;r<nBasis;r++) {
	for (var s=0;s<nBasis;s++) {
	    energy+=thisPmatr[r][s]*Hmatr[r][s]
	}
    }
    energy*=0.5;
    for (var i=0;i<nOcc;i++) {
	energy += sortedEvals[i];
    }
    energy+=Vnn;
    return energy;
}

function RHFsp(nAtom,nBasis,nOcc,atomPos,atomZ,basisPos,basisOrb) {
    var Smatr = numeric.rep([nBasis,nBasis],0);
    var Xmatr = numeric.rep([nBasis,nBasis],0);
    var Xdagmatr = numeric.rep([nBasis,nBasis],0);
    var Hmatr = numeric.rep([nBasis,nBasis],0);
    var Jmatr = new Array();
    var coeff = numeric.rep([nBasis,nBasis],0);
    var Pmatr = numeric.rep([nBasis,nBasis],0);
    var Fmatr = numeric.rep([nBasis,nBasis],0);
    var eigensolution;
    var Vnn = calcVnn(nAtom,atomZ,atomPos);
    //    console.log("Vnn = "+Vnn); //matches
    var iterationDetails = "";
	
    //Convert positions into Bohr Radius units
    for (var i=0;i<nAtom;i++) {
	for (var j=0;j<3;j++) {
	    atomPos[i][j] *= 0.529177211;
	}
    }
    for (var i=0;i<nBasis;i++) {
	for (var j=0;j<3;j++) {
	    basisPos[i][j] *= 0.529177211;
	}
    }

    for (var r=0;r<nBasis;r++) {
	Jmatr[r]=new Array();
	for (var s = 0; s<nBasis;s++) {
	    Jmatr[r][s]=new Array();
	    Smatr[r][s]= overlapInt(basisOrb[r],basisPos[r],basisOrb[s],basisPos[s]);
	    var Htmp = kineticEnInt(basisOrb[r],basisPos[r],basisOrb[s],basisPos[s]);
	    for (var c=0;c<nAtom;c++) {
		Htmp+=nuclearInt(basisOrb[r],basisPos[r],basisOrb[r],basisPos[s],atomZ[c],atomPos[c]);
	    }
	    Hmatr[r][s]=Htmp;
	    for (var t=0;t<nBasis;t++) {
		Jmatr[r][s][t]=new Array();
		for (var u=0; u<nBasis;u++) {
		    Jmatr[r][s][t][u]=twoelec(basisOrb[r],basisPos[r],basisOrb[s],basisPos[s],basisOrb[t],basisPos[t],basisOrb[u],basisPos[u]);
		}
	    }
	}
    } 

    // Build X matrix by canonical orthogonalization
    eigensolution = numeric.eig(Smatr);
    for (var i=0;i<nBasis;i++) {
	for (var j=0;j<nBasis;j++) {
	    Xmatr[i][j] = eigensolution.E.x[i][j]/Math.sqrt(eigensolution.lambda.x[j]);
	    Xdagmatr[j][i]=Xmatr[i][j]
	}
    }

    Pmatr = buildPmatr(coeff,nBasis,nOcc);
    /*
    console.log("Smatr = "+Smatr.toString()); //this matches CQM example
    console.log("Hmatr = "+Hmatr.toString()); //also matches
    console.log("Jmatr = "+Jmatr.toString()); //small (10^-4) variations in these; due to erf function approx?
    console.log(Xmatr.toString());
    console.log(Xdagmatr.toString());
    console.log(Pmatr.toString());
    */

    //begin SCF procedure
    var nIter = 0;
    var prevEnergy = 10;
    var energySCF = 10;

    do {
	prevEnergy = energySCF;
	nIter++;
	Fmatr = buildFmatr(Pmatr,Hmatr,Jmatr,nBasis,nOcc);
	eigensolution = numeric.eig( numeric.dot(numeric.dot(Xdagmatr,Fmatr),Xmatr));
		
	//	console.log("iteration "+nIter);
	//console.log(Fmatr.toString());
	//console.log(coeff.toString());
	//console.log(eigensolution.lambda.x[1]);

	//need to sort eigenvalues/vectors manually.  At least the vectors are normalized
	
	var esolution = new Array(nBasis);
	for (var i=0;i<nBasis;i++) {
	    esolution[i]= {thisEval: eigensolution.lambda.x[i], order:i};
	}
	esolution.sort(function(a,b) {return (a.thisEval>b.thisEval ? 1 : a.thisEval<b.thisEval ? -1 : 0);});  
	
	var eigenvalues = numeric.rep([nBasis],0);
	var eigenvectors = numeric.rep([nBasis,nBasis],0);
	var currentEvec = numeric.rep([nBasis],0);

	for (var i = 0;i<nBasis;i++) {
	    eigenvalues[i] = esolution[i].thisEval;
	    for (var j=0;j<nBasis;j++) {
		currentEvec[j] = eigensolution.E.x[j][esolution[i].order];
	    }
	    currentEvec = numeric.dot(Xmatr,currentEvec);
	    for (var j=0;j<nBasis;j++) {
		eigenvectors[j][i]=currentEvec[j];
	    }	    
	}

	//console.log(eigenvalues.toString());
	//console.log(eigenvectors.toString());
	Pmatr = buildPmatr(eigenvectors,nBasis,nOcc);
	//console.log(Pmatr.toString());
	energySCF = calcHFenergy(eigenvalues,Pmatr,Vnn,Hmatr,nBasis,nOcc);
	//console.log(energySCF);
	
	iterationDetails += sprintf("iteration %3d:  E(SCF) = %16.8f;   Delta-E = %16.8f\n",nIter,energySCF,prevEnergy-energySCF);

    }while ((nIter < 60)&& (Math.abs(prevEnergy-energySCF) > 1.0e-6)); 


    return {totalEnergy: energySCF, evals:eigenvalues, evecs:eigenvectors, iterationDetails:iterationDetails}
    
}