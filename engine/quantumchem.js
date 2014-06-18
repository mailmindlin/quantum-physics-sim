
	

function  runQC(geometry,charge,spinMultiplicity,method,basisSet,jobType) {
    var atomZ = geometry.atomTypes;
    var nAtom = atomZ.length;
    var nBasis = nAtom; //limited to 1 basis function per atom
    var basisOrb = [];
    var basisPos = [];
    var nOcc;
    var hasErr = 0;
    var errString = "";

    var nElec = -charge;
    for (var i = 0; i < nAtom; i++) {
	if ((atomZ[i] < 1) || (atomZ[i]>2)) {
	    hasErr=1;
	    errString += "ERROR:  Only Hydrogen and Helium atoms are implemented in this version\n";
	}
	nElec+=atomZ[i];
	basisOrb[i] = sto1G[atomZ[i]][1];
	basisPos[i] = geometry.atomCoord[i];

    }
    if (nElec % 2 != 0) {  
	//throw error: only doubly-filled levels allowed for RHF
	hasErr=1;
	errString += "ERROR:  Only even numbers of electrons (doubly filled molecular orbitals) are implemented in this version; but you have "+nElec+" electrons\n"; 
    }
    nOcc = nElec/2;

    if (method.valueOf() != "RHF") {
	hasErr = 1;
	errString += "ERROR:  Only RHF is implemented in this version; but you have "+method+"\n";
    }

    if (basisSet.valueOf() != "STO-1G") {
	hasErr = 1;
	errString += "ERROR:  Only STO-1G basis set is implemented in this version; but you have "+basiSet+"\n";
    }

    if (spinMultiplicity != 1) {
	hasErr=1;
	errString += "ERROR:  Only singlet spin multiplicity is implemented in this version; but you have "+spinMultiplicity+"\n";
    }
    
    if (hasErr) {
	return {inputError: errString};
    } else {
	var results = RHFsp(nAtom,nBasis,nOcc,geometry.atomCoord,atomZ,basisPos,basisOrb); //this would be a place to spawn a WebWorker process; it should be short now, but potentially can be time consuming
	
	// Create a Gaussian-style formatted checkbount file http://www.gaussian.com/g_tech/g_ur/f_formchk.htm
	// WARNING:  This is really ugly

	var fchk = sprintf("%-72.72s\n%-10.10s%-30.30s%-30.30s\n%-40.40s   I     %12d\n%-40.40s   I     %12d\n%-40.40s   I     %12d\n%-40.40s   I     %12d\n%-40.40s   I     %12d\n%-40.40s   I     %12d\n%-40.40s   R     %-22.15e\n%-40.40s   R     %-22.15e\n","foobar",jobType,method,basisSet,"Number of atoms",nAtom,"Charge",charge,"Multiplicity",spinMultiplicity,"Number of electrons",nElec,"Number of alpha electrons",nOcc,"Number of basis functions",nBasis,"SCF Energy",results.totalEnergy,"Total Energy",results.totalEnergy);
	
	fchk+= sprintf("%-40.40s   I   N=%12d\n","Atomic numbers",nAtom);
	for (var i=0; i<nAtom;i+=6) {
	    for (var j=0;j<6;j++) {
		if (i+j<nAtom) {
		    fchk+=sprintf("%12d",atomZ[i+j]);
		}
	    }
	    fchk+="\n";
	}
	fchk+=sprintf("%-40.40s   R   N=%12d\n","Current cartesian coordinates",nAtom*3);
	var cartesian = ""
	var flatArray = [].concat.apply([],geometry.atomCoord);
	for (var i=0;i<flatArray.length;i+=5) {
	    for (var j=0;j<5;j++) {
		if (i+j < flatArray.length) {
		    cartesian+=sprintf("%-16.8e",flatArray[i+j]);
		}
	    }
	    cartesian+="\n";
	}
	fchk+=cartesian;
	fchk+=sprintf("%-40.40s   I   N=%12d\n","Shell types",nAtom);
	for (var i=0; i<nAtom;i+=6) {
            for (var j=0;j<6;j++) {
                if (i+j<nAtom) {
                    fchk+=sprintf("%12d",0); //for STO-1G
                }
            }
            fchk+="\n";
	}
	fchk+=sprintf("%-40.40s   I   N=%12d\n","Number of primitives per shell",nAtom);
        for (var i=0; i<nAtom;i+=6) {
            for (var j=0;j<6;j++) {
                if (i+j<nAtom) {
                    fchk+=sprintf("%12d",1); //for STO-1G                                                                     
                }
            }
            fchk+="\n";
        }
        fchk+=sprintf("%-40.40s   I   N=%12d\n","Shell to atom map",nAtom);
        for (var i=0; i<nAtom;i+=6) {
            for (var j=0;j<6;j++) {
                if (i+j<nAtom) {
                    fchk+=sprintf("%12d",i+j); //for STO-1G
		}
            }
            fchk+="\n";
        }
	fchk+=sprintf("%-40.40s   R   N=%12d\n","Primitive exponents",nBasis);
        for (var i=0;i<nBasis;i+=5) {
            for (var j=0;j<5;j++) {
                if (i+j < nBasis) {
                    fchk+=sprintf("%-16.8e",basisOrb[i+j]); //STO-1G
                }
            }
            fchk+="\n";
        }
	fchk+=sprintf("%-40.40s   R   N=%12d\n","Contraction coefficients",nBasis);
        for (var i=0;i<nBasis;i+=5) {
            for (var j=0;j<5;j++) {
                if (i+j < nBasis) {
                    fchk+=sprintf("%-16.8e",g1sNormConst(basisOrb[i+j])); //STO-1G
                }
            }
            fchk+="\n";
        }
	
	fchk+=sprintf("%-40.40s   R   N=%12d\n","Coordinates of each shell",nBasis*3);
	fchk+=cartesian; //STO-1G

	fchk+=sprintf("%-40.40s   R   N=%12d\n","Alpha Orbital Energies",nBasis);
	for (var i=0;i<nBasis;i+=5) {
            for (var j=0;j<5;j++) {
                if (i+j < nBasis) {
                    fchk+=sprintf("%-16.8e",results.evals[i+j]); 
                }
            }
            fchk+="\n";
        }

	fchk+=sprintf("%-40.40s   R   N=%12d\n","Alpha MO coefficients",nBasis*nBasis);
	flatArray = new Array (nBasis); 
	for (var MO=0;MO<nBasis;MO++) {
	    for (var AO=0;AO<nBasis;AO++) {
		flatArray[MO*nBasis+AO]=results.evecs[AO][MO]; //deal with the way that numeric.js lists eigenvalues
	    }
	}
        for (var i=0;i<nBasis*nBasis;i+=5) {
            for (var j=0;j<5;j++) {
                if (i+j < nBasis*nBasis) {
                    fchk+=sprintf("%-16.8e",flatArray[i+j]);
                }
            }
            fchk+="\n";
        }
	
	results.fchk = fchk;
	return results;
    }
}