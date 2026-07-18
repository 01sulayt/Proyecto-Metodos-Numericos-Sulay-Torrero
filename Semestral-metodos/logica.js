// Navegacion
function ir(id){
    document.querySelectorAll('.page').forEach(p=>p.classList.add('hide'));
    document.getElementById(id).classList.remove('hide');
    document.querySelectorAll('.navbar li').forEach(l=>l.classList.remove('active'));
    event.target.classList.add('active');
}
function ver(id){ document.getElementById(id).classList.toggle('hide'); }

// Formatear cifras significativas
function F(n, c){
    if(Math.abs(n) < 1e-12) return Number(0).toFixed(Math.max(0,c-1));
    return Number(n.toPrecision(c)).toString();
}

// ========== ERRORES ==========
function resEA(){
    const vr=+document.getElementById('vr-ea').value;
    const va=+document.getElementById('va-ea').value;
    const c=+document.querySelector('input[name="p-ea"]:checked').value;
    const ea=Math.abs(vr-va);
    const o=document.getElementById('out-ea');
    o.classList.remove('hide');
    o.innerHTML = `Ea = | ${F(vr,c)} − ${F(va,c)} | = <strong>${F(ea,c)}</strong> &nbsp;&nbsp; (${c} cifras)`;
}
function resER(){
    const vr=+document.getElementById('vr-er').value;
    const va=+document.getElementById('va-er').value;
    const c=+document.querySelector('input[name="p-er"]:checked').value;
    const ea=Math.abs(vr-va);
    const er= vr ? (ea/Math.abs(vr))*100 : Infinity;
    const o=document.getElementById('out-er');
    o.classList.remove('hide');
    o.innerHTML = `Er = (${F(ea,c)} / ${F(vr,c)}) × 100 = <strong>${F(er,c)} %</strong>`;
}

// ========== PUNTO FIJO ==========
function ejPF(){
    const g=new Function('x','return '+document.getElementById('g-pf').value);
    let x=+document.getElementById('x0-pf').value;
    const tol=+document.getElementById('tol-pf').value;
    const c=+document.querySelector('input[name="p-pf"]:checked').value;
    const t=document.getElementById('tab-pf');
    t.classList.remove('hide');
    let h='<table><tr><th>Iter</th><th>xₙ</th><th>xₙ₊₁ = g(xₙ)</th><th>Error |xₙ₊₁−xₙ|</th></tr>';
    let xn, err, it;
    for(it=1; it<=100; it++){
        xn = g(x);
        err = Math.abs(xn-x);
        h += `<tr><td>${it}</td><td>${F(x,c)}</td><td>${F(xn,c)}</td><td>${F(err,c)}</td></tr>`;
        if(err < tol) break;
        x = xn;
    }
    h += `</table><p style="margin-top:12px"><strong>Raíz ≈ ${F(xn,c)} &nbsp; | &nbsp; ${it} iteraciones</strong></p>`;
    t.innerHTML = h;
}

// ========== BISECCION ==========
function ejBis(){
    const f=new Function('x','return '+document.getElementById('f-bis').value);
    let a=+document.getElementById('a-bis').value, b=+document.getElementById('b-bis').value;
    const tol=+document.getElementById('tol-bis').value;
    const c=+document.querySelector('input[name="p-bis"]:checked').value;
    const t=document.getElementById('tab-bis');
    t.classList.remove('hide');
    if(f(a)*f(b) >= 0){ t.innerHTML='<p style="color:#cc0000"><strong>⚠ No hay cambio de signo en [a,b]</strong></p>'; return; }
    let h='<table><tr><th>Iter</th><th>a</th><th>b</th><th>c = (a+b)/2</th><th>f(c)</th><th>Error (b-a)/2</th></tr>';
    let cm, fc, err, it;
    for(it=1; it<=100; it++){
        cm=(a+b)/2; fc=f(cm); err=Math.abs(b-a)/2;
        h += `<tr><td>${it}</td><td>${F(a,c)}</td><td>${F(b,c)}</td><td>${F(cm,c)}</td><td>${F(fc,c)}</td><td>${F(err,c)}</td></tr>`;
        if(err < tol || Math.abs(fc) < 1e-12) break;
        (f(a)*fc < 0) ? b=cm : a=cm;
    }
    h += `</table><p style="margin-top:12px"><strong>Raíz ≈ ${F(cm,c)} &nbsp; | &nbsp; ${it} iteraciones</strong></p>`;
    t.innerHTML = h;
}

// ========== NEWTON ==========
function ejNR(){
    const f=new Function('x','return '+document.getElementById('f-nr').value);
    const df=new Function('x','return '+document.getElementById('df-nr').value);
    let x=+document.getElementById('x0-nr').value;
    const c=+document.querySelector('input[name="p-nr"]:checked').value;
    const tol=0.0001;
    const t=document.getElementById('tab-nr');
    t.classList.remove('hide');
    let h='<table><tr><th>Iter</th><th>xₙ</th><th>f(xₙ)</th><th>f\'(xₙ)</th><th>xₙ₊₁</th><th>Error</th></tr>';
    let xn,fx,dfx,x1,err,it;
    for(it=1; it<=50; it++){
        xn=x; fx=f(xn); dfx=df(xn);
        if(Math.abs(dfx)<1e-12){ t.innerHTML='<p style="color:#cc0000">Derivada = 0, no se puede continuar</p>'; return; }
        x1 = xn - fx/dfx; err = Math.abs(x1-xn);
        h += `<tr><td>${it}</td><td>${F(xn,c)}</td><td>${F(fx,c)}</td><td>${F(dfx,c)}</td><td>${F(x1,c)}</td><td>${F(err,c)}</td></tr>`;
        if(err < tol) break;
        x = x1;
    }
    h += `</table><p><strong>Raíz ≈ ${F(x1,c)} &nbsp; | &nbsp; ${it} iteraciones</strong></p>`;
    t.innerHTML = h;
}

// ========== SECANTE ==========
function ejSec(){
    const f=new Function('x','return '+document.getElementById('f-sec').value);
    let x0=+document.getElementById('x0-sec').value, x1=+document.getElementById('x1-sec').value;
    const c=+document.querySelector('input[name="p-sec"]:checked').value;
    const tol=0.0001;
    const t=document.getElementById('tab-sec');
    t.classList.remove('hide');
    let h='<table><tr><th>Iter</th><th>x₀</th><th>x₁</th><th>f(x₀)</th><th>f(x₁)</th><th>x₂</th><th>Error</th></tr>';
    let x2,fx0,fx1,err,it;
    for(it=1; it<=50; it++){
        fx0=f(x0); fx1=f(x1);
        if(Math.abs(fx1-fx0)<1e-12) break;
        x2 = x1 - fx1*(x1-x0)/(fx1-fx0);
        err = Math.abs(x2-x1);
        h += `<tr><td>${it}</td><td>${F(x0,c)}</td><td>${F(x1,c)}</td><td>${F(fx0,c)}</td><td>${F(fx1,c)}</td><td>${F(x2,c)}</td><td>${F(err,c)}</td></tr>`;
        if(err < tol) break;
        x0=x1; x1=x2;
    }
    h += `</table><p><strong>Raíz ≈ ${F(x2,c)} &nbsp; | &nbsp; ${it} iteraciones</strong></p>`;
    t.innerHTML = h;
}

// ========== GAUSSIANA 4x4 NUEVA ==========
function genGauss(){
    const n=+document.getElementById('n-gauss').value;
    const c=document.getElementById('m-gauss'); c.innerHTML='';
    // Matriz NUEVA 4x4 (nunca usada en ejemplo original)
    const def=[
        [2,1,-1,2,5],
        [4,5,-3,6,9],
        [-2,5,-2,6,4],
        [4,11,-4,8,2]
    ];
    for(let i=0;i<n;i++){
        const r=document.createElement('div'); r.className='m-row';
        for(let j=0;j<n;j++){
            const v = def[i] && def[i][j]!==undefined ? def[i][j] : Math.floor(Math.random()*10);
            r.innerHTML += `<input type="number" step="any" value="${v}">`;
        }
        r.innerHTML += '<span class="sep">|</span>';
        const vb = def[i] && def[i][n]!==undefined ? def[i][n] : Math.floor(Math.random()*10);
        r.innerHTML += `<input type="number" step="any" value="${vb}">`;
        c.appendChild(r);
    }
}
function ejGauss(){
    const n=+document.getElementById('n-gauss').value;
    const filas=document.querySelectorAll('#m-gauss .m-row');
    const c=+document.querySelector('input[name="p-gauss"]:checked').value;
    let M=[];
    filas.forEach(f=>{
        const v=f.querySelectorAll('input');
        M.push(Array.from(v).map(i=>+i.value));
    });
    const show=()=>M.map(f=>'[ '+f.map(v=>F(v,c)).join('  ')+' ]').join('\n');
    let p='📋 PASO A PASO - ELIMINACIÓN GAUSSIANA\n\n';
    p += `🔹 ETAPA INICIAL (Matriz Aumentada [A|b]):\n${show()}\n\n`;
    
    // Eliminacion hacia adelante
    for(let i=0;i<n;i++){
        for(let j=i+1;j<n;j++){
            const fac = M[j][i]/M[i][i];
            for(let k=i;k<=n;k++) M[j][k] -= fac*M[i][k];
        }
        p += `🔹 ETAPA ${i+1} (ceros debajo de A[${i+1}][${i+1}]):\n${show()}\n\n`;
    }
    
    // Sustitucion atras
    let S=Array(n).fill(0);
    for(let i=n-1;i>=0;i--){
        S[i]=M[i][n];
        for(let j=i+1;j<n;j++) S[i]-=M[i][j]*S[j];
        S[i]/=M[i][i];
    }
    p += `🔹 SUSTITUCIÓN HACIA ATRÁS COMPLETADA\n\n`;
    
    document.getElementById('proc-gauss').classList.remove('hide');
    document.getElementById('proc-gauss').textContent = p;
    document.getElementById('sol-gauss').classList.remove('hide');
    document.getElementById('sol-gauss').innerHTML = 
        '🎯 SOLUCIÓN FINAL: &nbsp;&nbsp;' + 
        S.map((v,i)=>`<strong>x${i+1} = ${F(v,c)}</strong>`).join(' &nbsp;&nbsp;&nbsp; ');
}

// ========== JORDAN ==========
function genJordan(){
    const n=+document.getElementById('n-jordan').value;
    const c=document.getElementById('m-jordan'); c.innerHTML='';
    // Matriz NUEVA 3x3
    const def=[
        [3,-2,4,7],
        [1,1,-1,-2],
        [2,3,5,10]
    ];
    for(let i=0;i<n;i++){
        const r=document.createElement('div'); r.className='m-row';
        for(let j=0;j<n;j++){
            const v = def[i] && def[i][j]!==undefined ? def[i][j] : Math.floor(Math.random()*10);
            r.innerHTML += `<input type="number" step="any" value="${v}">`;
        }
        r.innerHTML += '<span class="sep">|</span>';
        const vb = def[i] && def[i][n]!==undefined ? def[i][n] : Math.floor(Math.random()*10);
        r.innerHTML += `<input type="number" step="any" value="${vb}">`;
        c.appendChild(r);
    }
}
function ejJordan(){
    const n=+document.getElementById('n-jordan').value;
    const filas=document.querySelectorAll('#m-jordan .m-row');
    const c=+document.querySelector('input[name="p-jordan"]:checked').value;
    let M=[];
    filas.forEach(f=>{
        const v=f.querySelectorAll('input');
        M.push(Array.from(v).map(i=>+i.value));
    });
    const show=()=>M.map(f=>'[ '+f.map(v=>F(v,c)).join('  ')+' ]').join('\n');
    let p='📋 PASO A PASO - GAUSS-JORDAN (hasta Identidad)\n\n';
    p += `🔹 ETAPA 0 (Matriz original):\n${show()}\n\n`;
    
    for(let i=0;i<n;i++){
        // Hacer 1 en el pivote
        const piv = M[i][i];
        for(let k=i;k<=n;k++) M[i][k]/=piv;
        // Hacer 0 en el resto
        for(let j=0;j<n;j++){
            if(j!==i){
                const fac = M[j][i];
                for(let k=i;k<=n;k++) M[j][k] -= fac*M[i][k];
            }
        }
        p += `🔹 ETAPA ${i+1} (pivote A[${i+1}][${i+1}] = 1, ceros en columna):\n${show()}\n\n`;
    }
    
    const S = M.map(f=>f[n]);
    document.getElementById('proc-jordan').classList.remove('hide');
    document.getElementById('proc-jordan').textContent = p;
    document.getElementById('sol-jordan').classList.remove('hide');
    document.getElementById('sol-jordan').innerHTML = 
        '🎯 SOLUCIÓN DIRECTA (última columna): &nbsp;&nbsp;' + 
        S.map((v,i)=>`<strong>x${i+1} = ${F(v,c)}</strong>`).join(' &nbsp;&nbsp;&nbsp; ');
}