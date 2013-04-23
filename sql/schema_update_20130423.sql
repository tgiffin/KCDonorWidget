/*
 Add password recovery columns
*/

select count(*) into @count from information_schema.columns
    where table_schema='klearchoice'
    and table_name='donor'
    and column_name='password_recovery';
    
